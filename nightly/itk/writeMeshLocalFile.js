var path = require('path');
var mime = require('mime-types');

var mimeToIO = require('./MimeToMeshIO.js');
var getFileExtension = require('./getFileExtension.js');
var extensionToIO = require('./extensionToMeshIO.js');
var MeshIOIndex = require('./MeshIOIndex.js');

var loadEmscriptenModule = require('./loadEmscriptenModuleNode.js');
var writeMeshEmscriptenFSFile = require('./writeMeshEmscriptenFSFile.js');

/**
 * Write a mesh to a file on the local filesystem in Node.js.
 *
 * @param: useCompression compression the pixel data when possible
 * @param: binaryFileType write in an binary as opposed to a ascii format, if
 * possible
 * @param: mesh itk.Mesh instance to write
 * @param: filePath path to the file on the local filesystem.
 *
 * @return empty Promise
 */
var writeMeshLocalFile = function writeMeshLocalFile(_ref, mesh, filePath) {
  var useCompression = _ref.useCompression,
      binaryFileType = _ref.binaryFileType;

  return new Promise(function (resolve, reject) {
    var meshIOsPath = path.resolve(__dirname, 'MeshIOs');
    var absoluteFilePath = path.resolve(filePath);
    try {
      var mimeType = mime.lookup(absoluteFilePath);
      var extension = getFileExtension(absoluteFilePath);

      var io = null;
      if (mimeToIO.hasOwnProperty(mimeType)) {
        io = mimeToIO[mimeType];
      } else if (extensionToIO.hasOwnProperty(extension)) {
        io = extensionToIO[extension];
      } else {
        for (var idx = 0; idx < MeshIOIndex.length; ++idx) {
          var _modulePath = path.join(meshIOsPath, MeshIOIndex[idx]);
          var _Module = loadEmscriptenModule(_modulePath);
          var meshIO = new _Module.ITKMeshIO();
          _Module.mountContainingDirectory(absoluteFilePath);
          meshIO.SetFileName(absoluteFilePath);
          if (meshIO.CanWriteFile(absoluteFilePath)) {
            io = MeshIOIndex[idx];
            _Module.unmountContainingDirectory(absoluteFilePath);
            break;
          }
          _Module.unmountContainingDirectory(absoluteFilePath);
        }
      }
      if (io === null) {
        reject(Error('Could not find IO for: ' + absoluteFilePath));
      }

      var modulePath = path.join(meshIOsPath, io);
      var Module = loadEmscriptenModule(modulePath);
      Module.mountContainingDirectory(absoluteFilePath);
      writeMeshEmscriptenFSFile(Module, { useCompression: useCompression, binaryFileType: binaryFileType }, mesh, absoluteFilePath);
      Module.unmountContainingDirectory(absoluteFilePath);
      resolve(null);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = writeMeshLocalFile;