import SvgIcon from 'paraview-glance/src/components/widgets/SvgIcon';
import { mapState } from 'vuex';

import Datasets from 'paraview-glance/src/components/core/Datasets';

import { Authentication as GirderAuthentication } from '@girder/components/src/components';
import { FileManager as GirderFileManager } from '@girder/components/src/components/Snippet';
import { Upload as GirderUpload } from '@girder/components/src/utils';

import writeImageArrayBuffer from 'itk/writeImageArrayBuffer';

import ITKHelper from 'vtk.js/Sources/Common/DataModel/ITKHelper';

export default {
  name: 'GirderBox',
  components: {
    SvgIcon,
    GirderAuthentication,
    GirderFileManager,
    Datasets,
  },
  inject: ['girderRest', '$notify'],
  data() {
    return {
      selected: [],
      internalLocation: null,
      changeServer: false,
      newGirderURL: this.girderRest.apiRoot,
      changeURLPrompt: false,
    };
  },
  computed: {
    currentUserLogin() {
      return this.girderRest.user ? this.girderRest.user.login : 'anonymous';
    },
    loggedOut() {
      return this.girderRest.user === null;
    },
    location: {
      get() {
        return (
          this.internalLocation ||
          (this.loggedOut
            ? {
                // Stephen's COVID19 dataset
                _id: '5e84eb3e2660cbefba7d71d9',
                _modelType: 'folder',
              }
            : this.girderRest.user)
        );
      },
      set(value) {
        this.internalLocation = value;
      },
    },
    noURLChange() {
      return this.newGirderURL === this.girderRest.apiRoot;
    },
    ...mapState('widgets', {
      dataMeasurements: 'measurements',
    }),
  },
  mounted() {
    // TODO these can be moved to store when we add girder
    // state to store
    this.$root.$on('girder_upload_proxy', (proxyId) => {
      this.upload(proxyId);
    });
    this.$root.$on('girder_upload_measurements', (proxyId) => {
      this.uploadMeasurements(proxyId);
    });
  },
  methods: {
    load() {
      const rfiles = this.selected.map((elem) => {
        return {
          /* eslint-disable-next-line no-underscore-dangle */
          url: `${this.girderRest.apiRoot}/item/${elem._id}/download`,
          name: elem.name,
          withGirderToken: true,
          proxyKeys: {
            girderProvenance: {
              ...this.location,
              apiRoot: this.girderRest.apiRoot,
            },
            girderItem: {
              /* eslint-disable-next-line no-underscore-dangle */
              itemId: elem._id,
              itemName: elem.name,
            },
            meta: elem.meta,
          },
        };
      });

      this.$store.dispatch('files/openRemoteFiles', rfiles);
    },
    export2pc(proxyId) {
      const dataset = this.$proxyManager.getProxyById(proxyId).get().dataset;

      const image = ITKHelper.convertVtkToItkImage(dataset);
      // If we don't copy here, the renderer's copy of the ArrayBuffer
      // becomes invalid because it's been transferred:
      image.data = image.data.slice(0);
      writeImageArrayBuffer(null, false, image, 'out.mha').then(
        function recieve({ arrayBuffer }) {
          const blob = new Blob([arrayBuffer]);
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.setAttribute('href', url);
          anchor.setAttribute('download', 'out.mha');

          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
        }
      );
    },
    checkUploadPossible() {
      if (this.loggedOut) {
        this.$notify(
          'Cannot upload to Girder unless logged in. Please log in then try again'
        );
        return false;
      }
      if (!this.location) {
        this.$notify(
          'Cannot upload to Girder root location. Please navigate to a folder you own then try again'
        );
        return false;
      }
      /* eslint-disable-next-line no-underscore-dangle */
      if (this.location._modelType === 'user') {
        this.$notify(
          'Cannot upload here. Please select public or private and then try again'
        );
        return false;
      }
      return true;
    },
    upload(proxyId) {
      if (!this.checkUploadPossible()) {
        return;
      }
      const dataset = this.$proxyManager.getProxyById(proxyId).get().dataset;

      const metadata = {
        glanceDataType: dataset.getClassName(),
      };

      if (dataset.getClassName() === 'vtkLabelMap') {
        Object.assign(metadata, {
          colorMap: dataset.getColorMap(),
        });
      }

      this.$notify('Uploading...', true);

      const image = ITKHelper.convertVtkToItkImage(dataset);
      // If we don't copy here, the renderer's copy of the ArrayBuffer
      // becomes invalid because it's been transferred:
      image.data = image.data.slice(0);
      writeImageArrayBuffer(
        null,
        false,
        image,
        this.$proxyManager.getProxyById(proxyId).get().name
      ).then((valueReturned) => {
        const buffer = valueReturned.arrayBuffer;
        const blob = new Blob([buffer]);
        const file = new File(
          [blob],
          this.$proxyManager.getProxyById(proxyId).get().name
        );
        const upload = new GirderUpload(file, {
          $rest: this.girderRest,
          parent:
            this.$proxyManager
              .getProxyById(proxyId)
              .getKey('girderProvenance') || this.location,
        });
        upload
          .start()
          .then((response) => {
            const { itemId } = response;
            this.girderRest.put(
              `${this.girderRest.apiRoot}/item/${itemId}`,
              `metadata=${JSON.stringify(metadata)}`
            );
            this.$notify('Image uploaded');
            this.$refs.girderFileManager.refresh();
          })
          .catch(() => {
            this.$notify('Upload error');
          });
      });
    },
    uploadMeasurements(proxyId) {
      if (!this.checkUploadPossible()) {
        return;
      }
      const measurements = this.dataMeasurements[proxyId];
      if (measurements) {
        const proxyName = this.$proxyManager.getProxyById(proxyId).getName();
        const name = `${proxyName}.measurements.json`;
        const file = new File([JSON.stringify(measurements)], name);
        this.$notify('Uploading...', true);
        const upload = new GirderUpload(file, {
          $rest: this.girderRest,
          parent:
            this.$proxyManager
              .getProxyById(proxyId)
              .getKey('girderProvenance') || this.location,
        });
        upload
          .start()
          .then(() => {
            this.$notify('Measurements uploaded');
            this.$refs.girderFileManager.refresh();
          })
          .catch(() => {
            this.$notify('Upload error');
          });
      }
    },
    refreshPage() {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      params.set('girderRoute', this.newGirderURL);
      url.search = params.toString();
      window.location.href = url.toString();
    },
    logout() {
      this.girderRest.logout();
    },
  },
};
