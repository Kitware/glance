import writeImageArrayBuffer from './writeImageArrayBuffer';
import writeMeshArrayBuffer from './writeMeshArrayBuffer';
import getFileExtension from './getFileExtension';
import extensionToMeshIO from './extensionToMeshIO';
import mimeToMeshIO from './MimeToMeshIO';

var writeArrayBuffer = function writeArrayBuffer(webWorker, useCompression, imageOrMesh, fileName, mimeType) {
  var extension = getFileExtension(fileName);
  var isMesh = !!extensionToMeshIO.has(extension) || !!mimeToMeshIO.has(mimeType);

  if (isMesh) {
    return writeMeshArrayBuffer(webWorker, useCompression, imageOrMesh, fileName, mimeType).catch(function () {
      webWorker.terminate();
      return writeImageArrayBuffer(null, useCompression, imageOrMesh, fileName, mimeType);
    });
  } else {
    return writeImageArrayBuffer(webWorker, useCompression, imageOrMesh, fileName, mimeType);
  }
};

export default writeArrayBuffer;