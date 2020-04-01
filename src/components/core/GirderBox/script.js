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
    ...mapState({
      proxyManager: 'proxyManager',
    }),
  },
  mounted() {
    this.$root.$on('girder_upload_proxy', (proxyId) => {
      this.upload(proxyId);
    });
  },
  methods: {
    load() {
      const rfiles = this.selected.map((elem) => {
        return {
          /* eslint-disable-next-line no-underscore-dangle */
          url: `${this.girderRest.apiRoot}/item/${elem._id}/download`,
          name: elem.name,
          proxyKeys: { girderProvenence: this.location },
        };
      });

      this.$store.dispatch('files/openRemoteFiles', rfiles);
    },
    export2pc(proxyId) {
      const dataset = this.proxyManager.getProxyById(proxyId).get().dataset;

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
      const dataset = this.proxyManager.getProxyById(proxyId).get().dataset;

      const image = ITKHelper.convertVtkToItkImage(dataset);
      // If we don't copy here, the renderer's copy of the ArrayBuffer
      // becomes invalid because it's been transferred:
      image.data = image.data.slice(0);
      writeImageArrayBuffer(
        null,
        false,
        image,
        this.proxyManager.getProxyById(proxyId).get().name
      ).then((valueReturned) => {
        const buffer = valueReturned.arrayBuffer;
        const blob = new Blob([buffer]);
        const file = new File(
          [blob],
          this.proxyManager.getProxyById(proxyId).get().name
        );
        const upload = new GirderUpload(file, {
          $rest: this.girderRest,
          parent:
            this.proxyManager
              .getProxyById(proxyId)
              .getKey('girderProvenence') || this.location,
        });
        upload.start().then((response) => {
          const { itemId } = response;
          this.girderRest
            .put(
              `${this.girderRest.apiRoot}/item/${itemId}`,
              `metadata=${JSON.stringify({
                glanceDataType: dataset.getClassName(),
              })}`
            )
            .then((response2) => {
              debugger;
              console.log(response2);
            });
          console.log();

          this.$refs.girderFileManager.refresh();
        });
      });
    },
  },
};
