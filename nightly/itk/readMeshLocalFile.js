var path = require('path');
var mime = require('mime-types');

var mimeToIO = require('./MimeToMeshIO.js');
var getFileExtension = require('./getFileExtension.js');
var extensionToIO = require('./extensionToMeshIO.js');
var MeshIOIndex = require('./MeshIOIndex.js');

var loadEmscriptenModule = require('./loadEmscriptenModuleNode.js');
var readMeshEmscriptenFSFile = require('./readMeshEmscriptenFSFile.js');

var readMeshLocalFile = function readMeshLocalFile(filePath) {
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
          if (meshIO.CanReadFile(absoluteFilePath)) {
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
      var mesh = readMeshEmscriptenFSFile(Module, absoluteFilePath);
      Module.unmountContainingDirectory(absoluteFilePath);
      resolve(mesh);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = readMeshLocalFile;