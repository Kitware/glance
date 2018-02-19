import vtkHttpDataAccessHelper from 'vtk.js/Sources/IO/Core/DataAccessHelper/HttpDataAccessHelper';

const READER_MAPPING = {};

const FETCH_DATA = {
  readAsArrayBuffer(url, progressCallback) {
    return vtkHttpDataAccessHelper.fetchBinary(url, { progressCallback });
  },
  readAsText(url, progressCallback) {
    return vtkHttpDataAccessHelper.fetchText({}, url, { progressCallback });
  },
};

function registerReader({
  extension,
  name,
  vtkReader,
  readMethod,
  parseMethod,
  fileNameMethod,
  sourceType,
  binary,
}) {
  READER_MAPPING[extension] = {
    name,
    vtkReader,
    readMethod: readMethod || binary ? 'readAsArrayBuffer' : 'readAsText',
    parseMethod: parseMethod || binary ? 'parseAsArrayBuffer' : 'parseAsText',
    fileNameMethod,
    sourceType,
  };
}

function getReader({ name }) {
  const ext = name
    .split('.')
    .pop()
    .toLowerCase();
  return READER_MAPPING[ext];
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

function readFile(file) {
  return new Promise((resolve, reject) => {
    const readerMapping = getReader(file);
    if (readerMapping) {
      const {
        vtkReader,
        readMethod,
        parseMethod,
        fileNameMethod,
        sourceType,
      } = readerMapping;
      const reader = vtkReader.newInstance();
      const io = new FileReader();
      io.onload = function onLoad(e) {
        if (fileNameMethod) {
          reader[fileNameMethod](file.name);
        }
        const ds = reader[parseMethod](io.result);
        Promise.resolve(ds).then((dataset) => {
          resolve({ dataset, reader, sourceType, name: file.name });
        });
      };
      io[readMethod](file);
    } else {
      reject();
    }
  });
}

// ----------------------------------------------------------------------------

function loadFiles(files) {
  const promises = [];
  for (let i = 0; i < files.length; i++) {
    promises.push(readFile(files[i]));
  }
  return Promise.all(promises);
}

// ----------------------------------------------------------------------------

function downloadDataset(fileName, url, progressCallback) {
  return new Promise((resolve, reject) => {
    const readerMapping = getReader({ name: fileName });
    if (readerMapping) {
      const { vtkReader, readMethod, parseMethod, sourceType } = readerMapping;
      const reader = vtkReader.newInstance();
      FETCH_DATA[readMethod](url, progressCallback).then((rawData) => {
        reader[parseMethod](rawData);
        resolve({ reader, sourceType, name: fileName });
      });
    } else {
      throw new Error(`No reader found for ${fileName}`);
    }
  });
}

// ----------------------------------------------------------------------------

function registerReadersToProxyManager(readers, proxyManager) {
  for (let i = 0; i < readers.length; i++) {
    const { reader, sourceType, name, dataset } = readers[i];
    if (reader) {
      const source = proxyManager.createProxy('Sources', 'TrivialProducer', {
        name,
      });
      if (dataset && dataset.isA && dataset.isA('vtkDataSet')) {
        source.setInputData(dataset, sourceType);
      } else {
        source.setInputAlgorithm(reader, sourceType);
      }

      source.activate();

      proxyManager.createRepresentationInAllViews(source);
      proxyManager.renderAllViews();
    }
  }
}

// ----------------------------------------------------------------------------

export default {
  downloadDataset,
  openFiles,
  loadFiles,
  registerReader,
  listReaders,
  listSupportedExtensions,
  registerReadersToProxyManager,
};
