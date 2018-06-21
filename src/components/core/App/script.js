import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import ReaderFactory from 'paraview-glance/src/io/ReaderFactory';

import { Events, Messages } from 'paraview-glance/src/constants';
import Datasets from 'paraview-glance/src/components/core/Datasets';
import DragAndDrop from 'paraview-glance/src/components/widgets/DragAndDrop';
import GlobalSettings from 'paraview-glance/src/components/core/GlobalSettings';
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

function loadRemoteDataset(url, name, type) {
  if (!url || !name) {
    return Promise.reject(new Error('No url or name provided'));
  }

  this.loadingName = name;
  this.loadingProgress = 0;

  const progressCb = (progress) => {
    this.loadingProgress = Math.round((100 * progress.loaded) / progress.total);
  };

  return ReaderFactory.downloadDataset(name, url, progressCb)
    .then(({ reader, sourceType }) => {
      ReaderFactory.registerReadersToProxyManager(
        [{ reader, name, sourceType: type || sourceType }],
        this.proxyManager
      );
    })
    .then(() => {
      this.landing = false;
    })
    .finally(() => {
      this.loadingName = null;
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

function isClipboardEnabled() {
  try {
    return document.queryCommandSupported('copy');
  } catch (e) {
    return false;
  }
}

// ----------------------------------------------------------------------------

function copyErrorToClipboard() {
  this.$refs.errorTextarea.select();
  if (document.execCommand('copy')) {
    this.copiedToClipboard = true;
    window.setTimeout(() => {
      this.copiedToClipboard = false;
    }, 2000);
  }
}

// ----------------------------------------------------------------------------

export default {
  name: 'App',
  inject: ['proxyManager'],
  components: {
    Datasets,
    DragAndDrop,
    GlobalSettings,
    Landing,
    LayoutView,
    Notification,
    RawFileReader,
    Screenshots,
    SvgIcon,
  },
  data() {
    return {
      loadingName: null,
      loadingProgress: 0,
      landing: true,
      sidebar: true,
      aboutDialog: false,
      activeTab: 0,
      screenshotsDrawer: false,
      screenshotCount: 0,
      rawDialog: false,
      rawFile: null,
      errors: [],
      errorDialog: false,
      copiedToClipboard: false,
    };
  },
  computed: {
    readableErrors() {
      return `\`\`\`
${this.errors.join('\n\n----------next error----------\n\n')}
\`\`\``;
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
    loadFiles,
    openFile,
    loadRemoteDataset,
    loadPendingRawFile,
    closeRawFileDialog,
    recordError,
    isClipboardEnabled,
    copyErrorToClipboard,
  },
};
