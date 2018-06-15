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
import Screenshots from 'paraview-glance/src/components/core/Screenshots';

const DATA_TYPES = [
  {
    label: 'Integer 8',
    constructor: Int8Array,
    size: 1,
  },
  {
    label: 'Unsigned Integer 8',
    constructor: Uint8Array,
    size: 1,
  },
  {
    label: 'Integer 16',
    constructor: Int16Array,
    size: 2,
  },
  {
    label: 'Unsigned Integer 16',
    constructor: Uint16Array,
    size: 2,
  },
  {
    label: 'Integer 32',
    constructor: Int32Array,
    size: 4,
  },
  {
    label: 'Unsigned Integer 32',
    constructor: Uint32Array,
    size: 4,
  },
  {
    label: 'Float',
    constructor: Float32Array,
    size: 4,
  },
  {
    label: 'Double',
    constructor: Float64Array,
    size: 8,
  },
];

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
      this.raw.file = files[0];
      this.raw.dialog = true;
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
    this.loadingProgress = Math.round(100 * progress.loaded / progress.total);
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

function loadPendingRawFile() {
  return new Promise((resolve) => {
    const fio = new FileReader();
    fio.onload = function onFileReaderLoad() {
      const dataset = vtkImageData.newInstance({
        spacing: this.raw.spacing,
        extent: [
          0,
          this.raw.dimensions[0] - 1,
          0,
          this.raw.dimensions[1] - 1,
          0,
          this.raw.dimensions[2] - 1,
        ],
      });
      const scalars = vtkDataArray.newInstance({
        name: 'Scalars',
        values: new this.raw.dataType.constructor(fio.result),
      });
      dataset.getPointData().setScalars(scalars);

      ReaderFactory.registerReadersToProxyManager(
        [
          {
            name: this.raw.file.name,
            dataset,
          },
        ],
        this.proxyManager
      );

      resolve();
    }.bind(this);

    fio.readAsArrayBuffer(this.raw.file);
  }).then(() => {
    this.landing = false;
  });
}

// ----------------------------------------------------------------------------

function closeRawFile() {
  this.raw.file = null;
  this.raw.dialog = null;
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
    Screenshots,
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
      raw: {
        file: null,
        dialog: false,
        allDataTypes: DATA_TYPES,
        dataType: DATA_TYPES[0],
        dimensions: [1, 1, 1],
        spacing: [1, 1, 1],
      },
    };
  },
  computed: {
    effectiveRawSize() {
      return (
        this.raw.dimensions.reduce((t, v) => t * v, 1) * this.raw.dataType.size
      );
    },
  },
  methods: {
    loadFiles,
    openFile,
    loadRemoteDataset,
    loadPendingRawFile,
    closeRawFile,
  },
};
