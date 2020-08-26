import readImageFile from './readImageFile';
import readMeshFile from './readMeshFile';
import readPolyDataFile from './readPolyDataFile';
import getFileExtension from './getFileExtension';
import extensionToMeshIO from './extensionToMeshIO';
import extensionToPolyDataIO from './extensionToPolyDataIO';

var readFile = function readFile(webWorker, file) {
  var extension = getFileExtension(file.name);
  var isMesh = extensionToMeshIO.has(extension);
  var isPolyData = extensionToPolyDataIO.has(extension);

  if (isMesh) {
    return readMeshFile(webWorker, file)["catch"](function () {
      webWorker.terminate();
      return readImageFile(null, file);
    });
  } else if (isPolyData) {
    return readPolyDataFile(webWorker, file);
  } else {
    return readImageFile(webWorker, file);
  }
};

export default readFile;