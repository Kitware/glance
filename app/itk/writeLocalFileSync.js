var path = require('path');

var getFileExtension = require('./getFileExtension.js');

var extensionToMeshIO = require('./extensionToMeshIO.js');

var writeImageLocalFileSync = require('./writeImageLocalFileSync.js');

var writeMeshLocalFileSync = require('./writeMeshLocalFileSync.js');
/**
 * Write an image or mesh to a file on the local filesystem in Node.js.
 *
 * @param: useCompression compression the pixel data when possible
 * @param: imageOrMesh itk.Image or itk.Mesh instance to write
 * @param: filePath path to the file on the local filesystem.
 *
 * @return empty Promise
 */


var writeLocalFileSync = function writeLocalFileSync(useCompression, imageOrMesh, filePath) {
  var absoluteFilePath = path.resolve(filePath);
  var extension = getFileExtension(absoluteFilePath);
  var isMesh = extensionToMeshIO.has(extension);

  if (isMesh) {
    try {
      writeMeshLocalFileSync(useCompression, imageOrMesh, filePath);
      return;
    } catch (err) {
      // Was a .vtk image file? Continue to write as an image.
      writeImageLocalFileSync(useCompression, imageOrMesh, filePath);
    }
  } else {
    writeImageLocalFileSync(useCompression, imageOrMesh, filePath);
  }
};

module.exports = writeLocalFileSync;