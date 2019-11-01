import readImageBlob from './readImageBlob';
import readMeshBlob from './readMeshBlob';
import getFileExtension from './getFileExtension';
import extensionToMeshIO from './extensionToMeshIO';
import mimeToMeshIO from './MimeToMeshIO';

var readBlob = function readBlob(webWorker, blob, fileName, mimeType) {
  var extension = getFileExtension(fileName);
  var isMesh = !!extensionToMeshIO.has(extension) || !!mimeToMeshIO.has(mimeType);

  if (isMesh) {
    return readMeshBlob(webWorker, blob, fileName, mimeType).catch(function () {
      webWorker.terminate();
      return readImageBlob(null, blob, fileName, mimeType);
    });
  } else {
    return readImageBlob(webWorker, blob, fileName, mimeType);
  }
};

export default readBlob;