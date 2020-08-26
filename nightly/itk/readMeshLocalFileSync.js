var path = require('path');

var mime = require('mime-types');

var mimeToIO = require('./MimeToMeshIO.js');

var getFileExtension = require('./getFileExtension.js');

var extensionToIO = require('./extensionToMeshIO.js');

var MeshIOIndex = require('./MeshIOIndex.js');

var loadEmscriptenModule = require('./loadEmscriptenModuleNode.js');

var readMeshEmscriptenFSFile = require('./readMeshEmscriptenFSFile.js');

var readMeshLocalFileSync = function readMeshLocalFileSync(filePath) {
  var meshIOsPath = path.resolve(__dirname, 'MeshIOs');
  var absoluteFilePath = path.resolve(filePath);
  var mimeType = mime.lookup(absoluteFilePath);
  var extension = getFileExtension(absoluteFilePath);
  var io = null;

  if (mimeToIO.has(mimeType)) {
    io = mimeToIO.get(mimeType);
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension);
  } else {
    for (var idx = 0; idx < MeshIOIndex.length; ++idx) {
      var _modulePath = path.join(meshIOsPath, MeshIOIndex[idx]);

      var _Module = loadEmscriptenModule(_modulePath);

      var meshIO = new _Module.ITKMeshIO();

      var _mountedFilePath = _Module.mountContainingDirectory(absoluteFilePath);

      meshIO.SetFileName(_mountedFilePath);

      if (meshIO.CanReadFile(_mountedFilePath)) {
        io = MeshIOIndex[idx];

        _Module.unmountContainingDirectory(_mountedFilePath);

        break;
      }

      _Module.unmountContainingDirectory(_mountedFilePath);
    }
  }

  if (io === null) {
    throw Error('Could not find IO for: ' + absoluteFilePath);
  }

  var modulePath = path.join(meshIOsPath, io);
  var Module = loadEmscriptenModule(modulePath);
  var mountedFilePath = Module.mountContainingDirectory(absoluteFilePath);
  var mesh = readMeshEmscriptenFSFile(Module, mountedFilePath);
  Module.unmountContainingDirectory(mountedFilePath);
  return mesh;
};

module.exports = readMeshLocalFileSync;