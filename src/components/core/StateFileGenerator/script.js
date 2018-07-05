import JSZip from 'jszip';
import { mapState } from 'vuex';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function saveState(fileNameToUse) {
  const t = new Date();
  this.fileGenerationInProgress = true;
  this.fileName =
    fileNameToUse ||
    `${t.getFullYear()}${t.getMonth() +
      1}${t.getDate()}_${t.getHours()}-${t.getMinutes()}-${t.getSeconds()}.glance`;
  const userData = { layout: 'Something...', settings: { bg: 'white' } };
  const options = { recycleViews: true };
  const zip = new JSZip();
  zip.file(
    'state.json',
    JSON.stringify(this.proxyManager.saveState(options, userData), null, 2)
  );
  console.log('zip entry added, start compression...');
  zip
    .generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6,
      },
    })
    .then((blob) => {
      console.log('file generated', this.fileName, blob.size);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.setAttribute('href', url);
      anchor.setAttribute('download', this.fileName);
      anchor.click();
      this.fileGenerationInProgress = false;
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    });
}

// ----------------------------------------------------------------------------

export default {
  name: 'StateFileGenerator',
  inject: ['$globalBus'],
  data() {
    return {
      fileGenerationInProgress: false,
      fileName: '',
    };
  },
  computed: mapState(['proxyManager']),
  created() {
    this.$globalBus.$on('save-state', this.saveState);
  },
  beforeDestroy() {
    this.$globalBus.$off('save-state', this.saveState);
  },
  methods: {
    saveState,
  },
};
