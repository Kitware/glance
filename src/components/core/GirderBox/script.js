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
  inject: ['girderRest'],
  data() {
    return {
      selected: [],
      location: null,
      changeServer: false,
    };
  },
  computed: {
    currentUserLogin() {
      return this.girderRest.user ? this.girderRest.user.login : 'anonymous';
    },
    loggedOut() {
      return this.girderRest.user === null;
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
    upload(proxyId) {
      const dataset = this.$proxyManager.getProxyById(proxyId).get().dataset;

      const metadata = {
        glanceDataType: dataset.getClassName(),
      };

      if (dataset.getClassName() === 'vtkLabelMap') {
        Object.assign(metadata, {
          colorMap: dataset.getColorMap(),
        });
      }

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
        upload.start().then((response) => {
          const { itemId } = response;
          this.girderRest.put(
            `${this.girderRest.apiRoot}/item/${itemId}`,
            `metadata=${JSON.stringify(metadata)}`
          );

          this.$refs.girderFileManager.refresh();
        });
      });
    },
    uploadMeasurements(proxyId) {
      const measurements = this.dataMeasurements[proxyId];
      if (measurements) {
        const proxyName = this.$proxyManager.getProxyById(proxyId).getName();
        const name = `${proxyName}.measurements.json`;
        const file = new File([JSON.stringify(measurements)], name);
        const upload = new GirderUpload(file, {
          $rest: this.girderRest,
          parent:
            this.$proxyManager
              .getProxyById(proxyId)
              .getKey('girderProvenance') || this.location,
        });
        upload.start().then(() => this.$refs.girderFileManager.refresh());
      }
    },
  },
};
