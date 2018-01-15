import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';
import vtkXMLImageDataReader from 'vtk.js/Sources/IO/XML/XMLImageDataReader';

// ----------------------------------------------------------------------------

const READER_MAPPING = {};

function registerReader(extension, name, vtkReader, readMethod, parseMethod) {
  READER_MAPPING[extension] = { name, vtkReader, readMethod, parseMethod };
}

function getReader(file) {
  const { name } = file;
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

let fileCallback = null;

function handleFile(e) {
  if (fileCallback) {
    fileCallback(e.target.files[0]);
  }
  fileCallback = null;
}

const HIDDEN_FILE_ELEMENT = document.createElement('input');
HIDDEN_FILE_ELEMENT.setAttribute('type', 'file');
HIDDEN_FILE_ELEMENT.addEventListener('change', handleFile);

// ----------------------------------------------------------------------------

function openFile(extensions, onFileCallback) {
  fileCallback = onFileCallback;
  HIDDEN_FILE_ELEMENT.setAttribute(
    'accept',
    extensions.map((t) => `.${t}`).join(',')
  );
  HIDDEN_FILE_ELEMENT.click();
}

// ----------------------------------------------------------------------------

function loadFile(file) {
  HIDDEN_FILE_ELEMENT.value = null;
  return new Promise((resolve, reject) => {
    const readerMapping = getReader(file);
    if (readerMapping) {
      const { vtkReader, readMethod, parseMethod } = readerMapping;
      const reader = vtkReader.newInstance();
      const io = new FileReader();
      io.onload = function onLoad(e) {
        reader[parseMethod](io.result);
        resolve(reader);
      };
      io[readMethod](file);
    } else {
      reject();
    }
  });
}

// ----------------------------------------------------------------------------
// Register default readers
// ----------------------------------------------------------------------------

registerReader(
  'vtp',
  'Polydata Reader',
  vtkXMLPolyDataReader,
  'readAsArrayBuffer',
  'parseArrayBuffer'
);

registerReader(
  'vti',
  'ImageData Reader',
  vtkXMLImageDataReader,
  'readAsArrayBuffer',
  'parseArrayBuffer'
);

// ----------------------------------------------------------------------------

export default {
  openFile,
  loadFile,
  registerReader,
  listReaders,
  listSupportedExtensions,
};
