import JSZip from 'jszip';

import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import ReaderFactory from 'paraview-glance/src/io/ReaderFactory';

import { Events, Messages } from 'paraview-glance/src/constants';
import AboutBox from 'paraview-glance/src/components/core/AboutBox';
import BrowserIssues from 'paraview-glance/src/components/core/BrowserIssues';
import ControlsDrawer from 'paraview-glance/src/components/core/ControlsDrawer';
import DragAndDrop from 'paraview-glance/src/components/widgets/DragAndDrop';
import ErrorBox from 'paraview-glance/src/components/core/ErrorBox';
import Landing from 'paraview-glance/src/components/core/Landing';
import LayoutView from 'paraview-glance/src/components/core/LayoutView';
import Notification from 'paraview-glance/src/components/core/Notification';
import RawFileReader from 'paraview-glance/src/components/core/RawFileReader';
import Screenshots from 'paraview-glance/src/components/core/Screenshots';
import SvgIcon from 'paraview-glance/src/components/widgets/SvgIcon';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function loadFiles(files) {
  return ReaderFactory.loadFiles(files)
    .then((readers) => {
      ReaderFactory.registerReadersToProxyManager(readers, this.proxyManager);
    })
    .then(() => {
      this.landing = false;
    })
    .catch((error) => {
      if (error) {
        this.$globalBus.$emit(Events.MSG_ERROR, Messages.OPEN_ERROR);
      }
      // assume only one raw file being loaded for now
      this.rawFile = files[0];
      this.rawDialog = true;
    });
}

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

function loadRemoteDatasets(urls, names, types = []) {
  if (!urls || !urls.length || !names || !names.length) {
    return Promise.reject(new Error('No urls or names provided'));
  }

  this.loadingNames = names;
  this.loadingProgresses.splice(urls.length);

  const progressCb = (index) => (progress) => {
    this.$set(
      this.loadingProgresses,
      index,
      (100 * progress.loaded) / progress.total / urls.length
    );
  };

  const promises = [];
  for (let i = 0; i < urls.length; ++i) {
    promises.push(
      ReaderFactory.downloadDataset(names[i], urls[i], progressCb(i))
    );
  }

  return Promise.all(promises)
    .then((results) => {
      // show landing first, then actually load datasets
      // so representations have a view to bind to.
      this.landing = false;

      results.forEach(({ reader, sourceType }, i) => {
        ReaderFactory.registerReadersToProxyManager(
          [{ reader, name: names[i], sourceType: types[i] || sourceType }],
          this.proxyManager
        );
      });
    })
    .catch(() => {
      this.$globalBus.$emit(Events.MSG_ERROR, Messages.DOWNLOAD_FAILED);
    })
    .finally(() => {
      this.loadingNames = [];
      this.loadingProgresses = [];
    });
}

// ----------------------------------------------------------------------------

function openFile() {
  ReaderFactory.openFiles(ReaderFactory.listSupportedExtensions(), (files) =>
    this.loadFiles(files)
  );
}

// ----------------------------------------------------------------------------

function loadPendingRawFile({ dimensions, spacing, dataType }) {
  return new Promise((resolve) => {
    const fio = new FileReader();
    fio.onload = function onFileReaderLoad() {
      const dataset = vtkImageData.newInstance({
        spacing,
        extent: [
          0,
          dimensions[0] - 1,
          0,
          dimensions[1] - 1,
          0,
          dimensions[2] - 1,
        ],
      });
      const scalars = vtkDataArray.newInstance({
        name: 'Scalars',
        values: new dataType.constructor(fio.result),
      });
      dataset.getPointData().setScalars(scalars);

      ReaderFactory.registerReadersToProxyManager(
        [
          {
            name: this.rawFile.name,
            dataset,
          },
        ],
        this.proxyManager
      );

      resolve();
    }.bind(this);

    fio.readAsArrayBuffer(this.rawFile);
  }).then(() => {
    this.landing = false;
    this.closeRawFileDialog();
  });
}

// ----------------------------------------------------------------------------

function closeRawFileDialog() {
  this.rawFile = null;
  this.rawDialog = null;
}

// ----------------------------------------------------------------------------

function recordError(err) {
  this.errors.push(err);
}

// ----------------------------------------------------------------------------

export default {
  name: 'App',
  inject: ['proxyManager'],
  components: {
    AboutBox,
    BrowserIssues,
    ControlsDrawer,
    DragAndDrop,
    ErrorBox,
    Landing,
    LayoutView,
    Notification,
    RawFileReader,
    Screenshots,
    SvgIcon,
  },
  data() {
    return {
      loadingNames: [],
      loadingProgresses: [],
      landing: true,
      aboutDialog: false,
      errorDialog: false,
      controlsDrawer: true,
      screenshotsDrawer: false,
      screenshotCount: 0,
      rawDialog: false,
      rawFile: null,
      errors: [],
    };
  },
  computed: {
    totalLoadingProgress() {
      return this.loadingProgresses.reduce((sum, v) => sum + (v || 0), 0);
    },
  },
  mounted() {
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
    window.removeEventListener('error', this.recordError);
    if (this.origConsoleError) {
      window.console.error = this.origConsoleError;
    }
  },
  methods: {
    closeRawFileDialog,
    copyErrorToClipboard,
    isClipboardEnabled,
    loadFiles,
    loadPendingRawFile,
    loadRemoteDatasets,
    openFile,
    recordError,
    saveState,
    loadState,
  },
};
