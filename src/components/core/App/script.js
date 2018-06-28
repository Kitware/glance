import JSZip from 'jszip';

import ReaderFactory from 'paraview-glance/src/io/ReaderFactory';

import AboutBox from 'paraview-glance/src/components/core/AboutBox';
import BrowserIssues from 'paraview-glance/src/components/core/BrowserIssues';
import ControlsDrawer from 'paraview-glance/src/components/core/ControlsDrawer';
import DragAndDrop from 'paraview-glance/src/components/widgets/DragAndDrop';
import ErrorBox from 'paraview-glance/src/components/core/ErrorBox';
import FileLoader from 'paraview-glance/src/components/core/FileLoader';
import Landing from 'paraview-glance/src/components/core/Landing';
import LayoutView from 'paraview-glance/src/components/core/LayoutView';
import Notification from 'paraview-glance/src/components/core/Notification';
import Screenshots from 'paraview-glance/src/components/core/Screenshots';
import SvgIcon from 'paraview-glance/src/components/widgets/SvgIcon';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function saveState() {
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
      console.log('blob generated', blob);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.setAttribute('href', url);
      anchor.setAttribute('download', 'state.glance');
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    });
}

// ----------------------------------------------------------------------------

function loadState() {
  ReaderFactory.openFiles(['glance'], (files) => {
    const zip = new JSZip();
    zip.loadAsync(files[0]).then(() => {
      zip.forEach((relativePath, zipEntry) => {
        if (relativePath.match(/state\.json$/i)) {
          zipEntry.async('string').then((txt) => {
            const userData = this.proxyManager.loadState(JSON.parse(txt));
            this.landing = false;
            console.log(JSON.stringify(userData, null, 2));
          });
        }
      });
    });
  });
}

// ----------------------------------------------------------------------------

function navigate() {
}

// ----------------------------------------------------------------------------

export default {
  name: 'App',
  components: {
    AboutBox,
    BrowserIssues,
    ControlsDrawer,
    DragAndDrop,
    ErrorBox,
    FileLoader,
    Landing,
    LayoutView,
    Notification,
    Screenshots,
    SvgIcon,
  },
  data() {
    return {
      landing: true,
      aboutDialog: false,
      errorDialog: false,
      controlsDrawer: true,
      screenshotsDrawer: false,
      screenshotCount: 0,
      errors: [],
    };
  },
  watch: {
    landing(landing) {
      window.location.hash = landing ? '' : '#app';
    },
  },
  mounted() {
    window.addEventListener('hashchange', this.navigate);
    window.addEventListener('error', this.recordError);

    if (window.console) {
      this.origConsoleError = window.console.error;
      window.console.error = (...args) => {
        this.recordError(args.join(' '));
        return this.origConsoleError(...args);
      };
    }
  },
  beforeDestroy() {
    window.removeEventListener('hashchange', this.navigate);
    window.removeEventListener('error', this.recordError);

    if (this.origConsoleError) {
      window.console.error = this.origConsoleError;
    }
  },
  methods: {
    saveState,
    loadState,
    navigate() {
      this.landing = window.location.hash !== '#app';
    },
    recordError(error) {
      this.errors.push(error);
    },
    promptUserFiles() {
      this.$globalBus.$emit('prompt-user-files');
    },
    openUrls(urls, names) {
      this.$globalBus.$emit('open-remote-files', urls, names);
    },
    openFiles(files) {
      this.$globalBus.$emit('open-files', files);
    },
  },
};
