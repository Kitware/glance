import SvgIcon from 'paraview-glance/src/components/widgets/SvgIcon';
import { mapState } from 'vuex';

import Datasets from 'paraview-glance/src/components/core/Datasets';

import {
  GirderAuthentication,
  GirderFileManager,
  GirderUpload,
} from '@girder/components/src';

import writeImageArrayBuffer from 'itk/writeImageArrayBuffer';

import ITKHelper from 'paraview-glance/src/vtk/ITKHelper';
import vtkXMLPolyDataWriter from '@kitware/vtk.js/IO/XML/XMLPolyDataWriter';
import vtkXMLWriter from '@kitware/vtk.js/IO/XML/XMLWriter';
import vtkSTLWriter from '@kitware/vtk.js/IO/Geometry/STLWriter';

function arrayBufferToFile(ab, name) {
  const blob = new Blob([ab]);
  return new File([blob], name);
}

function writeDatasetToFile(dataset, name) {
  return new Promise((resolve, reject) => {
    if (dataset.isA('vtkImageData')) {
      const image = ITKHelper.convertVtkToItkImage(dataset);
      // If we don't copy here, the renderer's copy of the ArrayBuffer
      // becomes invalid because it's been transferred:
      image.data = image.data.slice(0);
      writeImageArrayBuffer(null, false, image, name).then((ab) =>
        resolve(arrayBufferToFile(ab, name))
      );
    } else if (dataset.isA('vtkPolyData')) {
      let writer = null;
      if (name.endsWith('.vtp')) {
        writer = vtkXMLPolyDataWriter.newInstance();
        writer.setFormat(vtkXMLWriter.FormatTypes.BINARY);
      } else if (name.endsWith('.stl')) {
        writer = vtkSTLWriter.newInstance();
      }

      if (writer) {
        resolve(arrayBufferToFile(writer.write(dataset), name));
      } else {
        reject(new Error(`Cannot save polydata dataset ${name}`));
      }
    } else {
      reject(new Error(`Cannot save dataset ${name}`));
    }
  });
}

export default {
  name: 'GirderBox',
  components: {
    SvgIcon,
    GirderAuthentication,
    GirderFileManager,
    Datasets,
    GirderUpload,
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
      const rfiles = this.selected.map((elem) => ({
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
      }));

      this.$store.dispatch('files/openRemoteFiles', rfiles);
    },
    export2pc(proxyId) {
      const dataset = this.$proxyManager.getProxyById(proxyId).get().dataset;

      const image = ITKHelper.convertVtkToItkImage(dataset);
      // If we don't copy here, the renderer's copy of the ArrayBuffer
      // becomes invalid because it's been transferred:
      image.data = image.data.slice(0);
      writeImageArrayBuffer(null, false, image, 'out.mha').then(
        ({ arrayBuffer }) => {
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
      const dataProxy = this.$proxyManager.getProxyById(proxyId);
      const dataset = dataProxy.getDataset();
      const name = dataProxy.getName();

      const metadata = {
        glanceDataType: dataset.getClassName(),
      };

      if (dataset.getClassName() === 'vtkLabelMap') {
        Object.assign(metadata, {
          colorMap: dataset.getColorMap(),
        });
      }

      this.$notify('Uploading...', true);

      writeDatasetToFile(dataset, name).then((file) => {
        const dest =
          this.$proxyManager.getProxyById(proxyId).getKey('girderProvenance') ||
          this.location;

        // hacky; I would extract the upload logic, but
        // this will do for now.
        this.$refs.girderUploader.setFiles([file]);
        this.$refs.girderUploader.inputFilesChanged([file]);
        this.$refs.girderUploader
          .start({
            dest,
            postUpload: ({ results }) => {
              const { itemId } = results[0];
              this.girderRest.put(
                `${this.girderRest.apiRoot}/item/${itemId}`,
                `metadata=${JSON.stringify(metadata)}`
              );
              this.$notify('Dataset uploaded');
              this.$refs.girderFileManager.refresh();
            },
          })
          .catch((e) => {
            this.$notify(`Upload error: ${e}`);
            console.error('Upload error', e);
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
        const dest =
          this.$proxyManager.getProxyById(proxyId).getKey('girderProvenance') ||
          this.location;

        this.$notify('Uploading...', true);

        // hacky; I would extract the upload logic, but
        // this will do for now.
        this.$refs.girderUploader.setFiles([file]);
        this.$refs.girderUploader.inputFilesChanged([file]);
        this.$refs.girderUploader
          .start({
            dest,
            postUpload: () => {
              this.$notify('Measurements uploaded');
              this.$refs.girderFileManager.refresh();
            },
          })
          .catch((e) => {
            this.$notify(`Upload error: ${e}`);
            console.error('Upload error', e);
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
