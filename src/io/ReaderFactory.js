import vtkHttpDataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import { createRepresentationInAllViews } from 'paraview-glance/src/utils';

const READER_MAPPING = {};

const FETCH_DATA = {
  readAsArrayBuffer(url, options) {
    return vtkHttpDataAccessHelper.fetchBinary(url, options);
  },
  readAsText(url, options) {
    return vtkHttpDataAccessHelper.fetchText({}, url, options);
  },
};

function registerReader({
  extension,
  name,
  vtkReader,
  readMethod,
  parseMethod,
  fileNameMethod,
  fileSeriesMethod,
  sourceType,
  binary,
}) {
  READER_MAPPING[extension] = {
    name,
    vtkReader,
    readMethod: readMethod || binary ? 'readAsArrayBuffer' : 'readAsText',
    parseMethod: parseMethod || binary ? 'parseAsArrayBuffer' : 'parseAsText',
    fileNameMethod,
    fileSeriesMethod,
    sourceType,
  };
}

function getReader({ name }) {
  const lowerCaseName = name.toLowerCase();
  const extToUse = Object.keys(READER_MAPPING).find((ext) =>
    lowerCaseName.endsWith(ext)
  );
  return READER_MAPPING[extToUse];
}

function listReaders() {
  return Object.keys(READER_MAPPING).map((ext) => ({
    name: READER_MAPPING[ext].name,
    ext,
  }));
}

function listSupportedExtensions() {
  return Object.keys(READER_MAPPING);
}

// ----------------------------------------------------------------------------

let filesCallback = null;

function handleFile(e) {
  if (filesCallback) {
    filesCallback(e.target.files);
  }
  filesCallback = null;
}

const HIDDEN_FILE_ELEMENT = document.createElement('input');
HIDDEN_FILE_ELEMENT.setAttribute('type', 'file');
HIDDEN_FILE_ELEMENT.setAttribute('multiple', 'multiple');
HIDDEN_FILE_ELEMENT.addEventListener('change', handleFile);

// ----------------------------------------------------------------------------

function openFiles(extensions, onFilesCallback) {
  filesCallback = onFilesCallback;
  HIDDEN_FILE_ELEMENT.setAttribute(
    'accept',
    extensions.map((t) => `.${t}`).join(',')
  );
  HIDDEN_FILE_ELEMENT.value = null;
  HIDDEN_FILE_ELEMENT.click();
}

// ----------------------------------------------------------------------------

function readRawData({ fileName, data }) {
  return new Promise((resolve, reject) => {
    const readerMapping = getReader({ name: fileName });
    if (readerMapping) {
      const { vtkReader, parseMethod, fileNameMethod, sourceType } =
        readerMapping;
      const reader = vtkReader.newInstance();
      if (fileNameMethod) {
        reader[fileNameMethod](fileName);
      }
      try {
        const ds = reader[parseMethod](data);
        Promise.resolve(ds)
          .then((dataset) =>
            resolve({ dataset, reader, sourceType, name: fileName })
          )
          .catch(reject);
      } catch (e) {
        reject(e);
      }
    } else {
      reject(new Error('No reader mapping'));
    }
  });
}

// ----------------------------------------------------------------------------

function readFile(file) {
  return new Promise((resolve, reject) => {
    const readerMapping = getReader(file);
    if (readerMapping) {
      const { readMethod } = readerMapping;
      const io = new FileReader();
      io.onload = function onLoad() {
        readRawData({ fileName: file.name, data: io.result })
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      };
      io[readMethod](file);
    } else {
      reject(new Error('No reader mapping'));
    }
  });
}

// ----------------------------------------------------------------------------

function loadFiles(files) {
  const promises = [];
  for (let i = 0; i < files.length; i += 1) {
    promises.push(readFile(files[i]));
  }
  return Promise.all(promises);
}

// ----------------------------------------------------------------------------

function loadFileSeries(files, extension, outFileName = '') {
  return new Promise((resolve, reject) => {
    if (files.length) {
      const readerMapping = READER_MAPPING[extension];
      if (readerMapping) {
        const { vtkReader, fileSeriesMethod, fileNameMethod, sourceType } =
          readerMapping;
        const reader = vtkReader.newInstance();

        if (fileNameMethod) {
          reader[fileNameMethod](outFileName);
        }

        if (fileSeriesMethod) {
          const ds = reader[fileSeriesMethod](files);
          Promise.resolve(ds).then((dataset) =>
            resolve({ dataset, reader, sourceType, name: outFileName })
          );
        } else {
          reject(new Error('No file series method available'));
        }
      } else {
        reject(new Error(`No file series reader mapping for ${extension}`));
      }
    } else {
      resolve(/* empty */);
    }
  });
}

// ----------------------------------------------------------------------------

function downloadDataset(fileName, url, options = {}) {
  return new Promise((resolve, reject) => {
    const readerMapping = getReader({ name: fileName });
    if (readerMapping) {
      const { readMethod } = readerMapping;
      FETCH_DATA[readMethod](url, options)
        .then((rawData) => {
          if (rawData) {
            resolve(new File([rawData], fileName));
          } else {
            throw new Error(`No data for ${fileName}`);
          }
        })
        .catch(reject);
    } else {
      throw new Error(`No reader found for ${fileName}`);
    }
  });
}

// ----------------------------------------------------------------------------

function registerReadersToProxyManager(readers, proxyManager) {
  const retlist = [];
  for (let i = 0; i < readers.length; i += 1) {
    const { reader, sourceType, name, dataset, metadata, proxyKeys } =
      readers[i];
    let retsource = null;
    if (reader || dataset) {
      const needSource =
        (reader && reader.getOutputData) ||
        (dataset && dataset.isA && dataset.isA('vtkDataSet'));
      let proxyName = 'TrivialProducer';
      if (
        proxyKeys &&
        proxyKeys.meta &&
        proxyKeys.meta.glanceDataType === 'vtkLabelMap'
      ) {
        proxyName = 'LabelMap';
      }
      const source = needSource
        ? proxyManager.createProxy('Sources', proxyName, {
            name,
            ...metadata,
          })
        : null;
      if (dataset && dataset.isA && dataset.isA('vtkDataSet')) {
        source.setInputData(dataset, sourceType);
      } else if (reader && reader.getOutputData) {
        source.setInputAlgorithm(reader, sourceType);
      } else if (reader && reader.setProxyManager) {
        reader.setProxyManager(proxyManager);
      } else {
        console.error(`No proper reader handler was found for ${name}`);
      }

      if (source) {
        createRepresentationInAllViews(proxyManager, source);
        if (proxyKeys) {
          Object.keys(proxyKeys).forEach((key) => {
            source.setKey(key, proxyKeys[key]);
            if (key === 'onLoad') {
              proxyKeys[key](source);
            }
          });
        }
      }

      if (
        reader &&
        reader.getCameraViewPoints &&
        reader.getCameraViewPoints()
      ) {
        proxyManager
          .getReferenceByName('$store')
          .dispatch('setCameraViewPoints', reader.getCameraViewPoints());
      }

      retsource = source;
    }
    retlist.push(retsource);
  }
  proxyManager.renderAllViews();
  return retlist;
}

// ----------------------------------------------------------------------------

function importBase64Dataset(
  fileName,
  base64String,
  proxyManager,
  chunkSize = 512
) {
  const chunks = [];
  const bytes = atob(base64String);
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const slice = bytes.slice(offset, offset + chunkSize);
    const array = new Uint8Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      array[i] = slice.charCodeAt(i);
    }
    chunks.push(array);
  }
  const blob = new Blob(chunks, { type: 'application/octet-stream' });
  const file = new File([blob], fileName);

  if (proxyManager) {
    loadFiles([file]).then((readers) => {
      registerReadersToProxyManager(readers, proxyManager);
    });
    return Promise.resolve('loading');
  }

  return loadFiles([file]);
}

// ----------------------------------------------------------------------------

export default {
  downloadDataset,
  listReaders,
  listSupportedExtensions,
  importBase64Dataset,
  loadFiles,
  loadFileSeries,
  openFiles,
  registerReader,
  registerReadersToProxyManager,
};
