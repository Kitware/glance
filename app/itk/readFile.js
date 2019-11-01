import readImageFile from './readImageFile';
import readMeshFile from './readMeshFile';
import getFileExtension from './getFileExtension';
import extensionToMeshIO from './extensionToMeshIO';

var readFile = function readFile(webWorker, file) {
  var extension = getFileExtension(file.name);
  var isMesh = extensionToMeshIO.has(extension);

  if (isMesh) {
    return readMeshFile(webWorker, file).catch(function () {
      webWorker.terminate();
      return readImageFile(null, file);
    });
  } else {
    return readImageFile(webWorker, file);
  }
};

export default readFile;