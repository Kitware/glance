import vtkXMLPolyDataReader  from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';
import vtkXMLImageDataReader from 'vtk.js/Sources/IO/XML/XMLImageDataReader';
import BinaryHelper          from 'vtk.js/Sources/IO/Core/BinaryHelper';

// ----------------------------------------------------------------------------

const READER_MAPPING = {
  vtp: vtkXMLPolyDataReader,
  vti: vtkXMLImageDataReader,
};

function getReader(file) {
  const { name } = file;
  const ext = name.split('.').pop().toLowerCase();
  return READER_MAPPING[ext];
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
  HIDDEN_FILE_ELEMENT.setAttribute('accept', extensions.map(t => `.${t}`).join(','));
  HIDDEN_FILE_ELEMENT.click();
}

// ----------------------------------------------------------------------------

function loadFile(file) {
  return new Promise((resolve, reject) => {
    const vtkReader = getReader(file);
    if (vtkReader) {
      const reader = vtkReader.newInstance();
      const io = new FileReader();
      io.onload = function onLoad(e) {
        const prefixRegex = /^\s*<AppendedData\s+encoding="raw">\s*_/m;
        const suffixRegex = /\n\s*<\/AppendedData>/m;
        const result = BinaryHelper.extractBinary(io.result, prefixRegex, suffixRegex);
        reader.parse(result.text, result.binaryBuffer);
        resolve(reader);
      };
      io.readAsArrayBuffer(file);
    } else {
      reject();
    }
  });
}

// ----------------------------------------------------------------------------

export default {
  openFile,
  loadFile,
};
