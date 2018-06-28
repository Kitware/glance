import JSZip from 'jszip';

import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import ReaderFactory from 'paraview-glance/src/io/ReaderFactory';
import RawFileReader from 'paraview-glance/src/components/core/RawFileReader';

// ----------------------------------------------------------------------------

function allWithErrors(promises) {
  return new Promise((resolve, reject) => {
    let okayCount = 0;
    const errors = Array(promises.length);
    Promise.all(
      promises.map((promise, index) =>
        promise
          .then((result) => {
            okayCount += 1;
            return result;
          })
          .catch((error) => {
            errors[index] = error;
          })
      )
    ).then((results) => {
      if (okayCount === promises.length) {
        resolve(results);
      } else {
        reject(errors);
      }
    });
  });
}

// ----------------------------------------------------------------------------

function readRawFile(file, { dimensions, spacing, dataType }) {
  return new Promise((resolve, reject) => {
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

      resolve(dataset);
    };

    fio.onerror = (error) => reject(error);

    fio.readAsArrayBuffer(file);
  });
}

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function openFiles(files) {
  this.files = Array.from(files).map((file) => ({
    type: 'file',
    name: file.name,
    file,
    issue: file.name.endsWith('.raw'),
    extension: file.name.split('.').pop(),
  }));

  let hasIssue = false;
  for (let i = 0; i < this.files.length; ++i) {
    if (this.files[i].issue) {
      hasIssue = true;
      break;
    }
  }

  if (hasIssue) {
    this.stage = 'preload';
  } else {
    this.loadFiles();
  }
}

// ----------------------------------------------------------------------------

function openRemoteDatasets(urls, names, types = []) {
  if (!urls || !urls.length || !names || !names.length) {
    return Promise.reject(new Error('No urls or names provided'));
  }

  this.files = urls.map((url, index) => ({
    type: 'url',
    name: names[index],
    url,
  }));

  this.stage = 'load';
  this.progresses.splice(urls.length);

  const progressCb = (index) => (progress) => {
    this.$set(
      this.progresses,
      index,
      (100 * progress.loaded) / progress.total / urls.length
    );
  };

  const promises = [];
  for (let i = 0; i < urls.length; ++i) {
    promises.push(
      ReaderFactory.downloadDataset(names[i], urls[i], progressCb(i)).then(
        ({ reader, sourceType }) =>
          ReaderFactory.registerReadersToProxyManager(
            [{ reader, name: names[i], sourceType: types[i] || sourceType }],
            this.proxyManager
          )
      )
    );
  }

  return allWithErrors(promises)
    .then(this.closeAndLoad)
    .catch((errors) => {
      this.stage = 'error';
      for (let i = 0; i < errors.length; ++i) {
        if (errors[i]) {
          this.files[i].error = errors[i];
        }
      }
    });
}

// ----------------------------------------------------------------------------

function promptForFiles() {
  const exts = ['raw', 'glance'].concat(
    ReaderFactory.listSupportedExtensions()
  );
  ReaderFactory.openFiles(exts, this.openFiles);
}

// ----------------------------------------------------------------------------

function loadState(file) {
  return new Promise((resolve) => {
    const zip = new JSZip();
    zip.loadAsync(file).then(() => {
      zip.forEach((relativePath, zipEntry) => {
        if (relativePath.match(/state\.json$/i)) {
          zipEntry.async('string').then((txt) => {
            const userData = this.proxyManager.loadState(JSON.parse(txt));
            console.log(JSON.stringify(userData, null, 2));
            resolve(userData);
          });
        }
      });
    });
  });
}

// ----------------------------------------------------------------------------

function loadFiles() {
  this.stage = 'load';

  const promises = this.files.map((file) => {
    // Handle raw
    if (file.rawInfo) {
      return readRawFile(file.file, file.rawInfo).then((dataset) =>
        ReaderFactory.registerReadersToProxyManager(
          [
            {
              name: file.name,
              dataset,
            },
          ],
          this.proxyManager
        )
      );
    }

    // Handle state file
    if (file.extension === 'glance') {
      return this.loadState(file.file);
    }

    return ReaderFactory.loadFiles([file.file]).then((readers) =>
      ReaderFactory.registerReadersToProxyManager(readers, this.proxyManager)
    );
  });

  return allWithErrors(promises)
    .then(this.closeAndLoad)
    .catch((errors) => {
      this.stage = 'error';
      for (let i = 0; i < errors.length; ++i) {
        if (errors[i]) {
          this.files[i].error = errors[i];
        }
      }
    });
}

// ----------------------------------------------------------------------------

export default {
  name: 'FileLoader',
  inject: ['proxyManager'],
  components: {
    RawFileReader,
  },
  data() {
    return {
      stage: '',
      files: [],
      progresses: [],
    };
  },
  computed: {
    totalProgress() {
      return this.progresses.reduce((sum, v) => sum + (v || 0), 0);
    },
  },
  created() {
    this.$globalBus.$on('prompt-user-files', this.promptForFiles);
    this.$globalBus.$on('open-remote-files', this.openRemoteDatasets);
    this.$globalBus.$on('open-files', this.openFiles);
  },
  beforeDestroy() {
    this.$globalBus.$off('prompt-user-files', this.promptForFiles);
    this.$globalBus.$off('open-remote-files', this.openRemoteDatasets);
    this.$globalBus.$off('open-files', this.openFiles);
  },
  methods: {
    openFiles,
    openRemoteDatasets,
    promptForFiles,
    loadFiles,
    loadState,
    preloadCanLoad() {
      return this.files.reduce((flag, { issue }) => flag && !issue, true);
    },
    closeAndLoad() {
      this.stage = '';
      const allFilesErrored = this.files.reduce(
        (flag, { error }) => flag && error,
        true
      );
      if (!allFilesErrored) {
        this.$emit('load');
      }
    },
  },
};
