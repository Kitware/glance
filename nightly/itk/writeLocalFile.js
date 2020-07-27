var path = require('path');

var getFileExtension = require('./getFileExtension.js');

var extensionToMeshIO = require('./extensionToMeshIO.js');

var writeImageLocalFile = require('./writeImageLocalFile.js');

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


var writeLocalFile = function writeLocalFile(useCompression, imageOrMesh, filePath) {
  var absoluteFilePath = path.resolve(filePath);
  var extension = getFileExtension(absoluteFilePath);
  return new Promise(function (resolve, reject) {
    try {
      var isMesh = extensionToMeshIO.has(extension);

      if (isMesh) {
        try {
          writeMeshLocalFileSync(useCompression, imageOrMesh, filePath);
          resolve(null);
        } catch (err) {
          // Was a .vtk image file? Continue to write as an image.
          writeImageLocalFile(useCompression, imageOrMesh, filePath).then(function () {
            resolve(null);
          });
        }
      } else {
        writeImageLocalFile(useCompression, imageOrMesh, filePath).then(function () {
          resolve(null);
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = writeLocalFile;