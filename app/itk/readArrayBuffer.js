import readImageArrayBuffer from './readImageArrayBuffer';
import readMeshArrayBuffer from './readMeshArrayBuffer';
import getFileExtension from './getFileExtension';
import extensionToMeshIO from './extensionToMeshIO';
import mimeToMeshIO from './MimeToMeshIO';

var readArrayBuffer = function readArrayBuffer(webWorker, arrayBuffer, fileName, mimeType) {
  var extension = getFileExtension(fileName);
  var isMesh = !!extensionToMeshIO.has(extension) || !!mimeToMeshIO.has(mimeType);

  if (isMesh) {
    return readMeshArrayBuffer(webWorker, arrayBuffer, fileName, mimeType).catch(function () {
      webWorker.terminate();
      return readImageArrayBuffer(null, arrayBuffer, fileName, mimeType);
    });
  } else {
    return readImageArrayBuffer(webWorker, arrayBuffer, fileName, mimeType);
  }
};

export default readArrayBuffer;