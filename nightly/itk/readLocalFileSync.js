var path = require('path');

var getFileExtension = require('./getFileExtension.js');

var extensionToMeshIO = require('./extensionToMeshIO.js');

var readImageLocalFileSync = require('./readImageLocalFileSync.js');

var readMeshLocalFileSync = require('./readMeshLocalFileSync.js');
/**
 * Read an image or mesh from a file on the local filesystem in Node.js.
 *
 * @param: filePath path to the file on the local filesystem.
 */


var readLocalFileSync = function readLocalFileSync(filePath) {
  var absoluteFilePath = path.resolve(filePath);
  var extension = getFileExtension(absoluteFilePath);
  var isMesh = extensionToMeshIO.has(extension);

  if (isMesh) {
    try {
      var mesh = readMeshLocalFileSync(filePath);
      return mesh;
    } catch (err) {
      // Was a .vtk image file? Continue to read as an image.
      var image = readImageLocalFileSync(filePath);
      return image;
    }
  } else {
    var _image = readImageLocalFileSync(filePath);

    return _image;
  }
};

module.exports = readLocalFileSync;