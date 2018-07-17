var path = require('path');
var mime = require('mime-types');

var mimeToIO = require('./MimeToImageIO.js');
var getFileExtension = require('./getFileExtension.js');
var extensionToIO = require('./extensionToImageIO.js');
var ImageIOIndex = require('./ImageIOIndex.js');

var loadEmscriptenModule = require('./loadEmscriptenModuleNode.js');
var writeImageEmscriptenFSFile = require('./writeImageEmscriptenFSFile.js');

/**
 * Write an image to a file on the local filesystem in Node.js.
 *
 * @param: useCompression compression the pixel data when possible
 * @param: image itk.Image instance to write
 * @param: filePath path to the file on the local filesystem.
 *
 * @return empty Promise
 */
var writeImageLocalFile = function writeImageLocalFile(useCompression, image, filePath) {
  return new Promise(function (resolve, reject) {
    var imageIOsPath = path.resolve(__dirname, 'ImageIOs');
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
        for (var idx = 0; idx < ImageIOIndex.length; ++idx) {
          var _modulePath = path.join(imageIOsPath, ImageIOIndex[idx]);
          var _Module = loadEmscriptenModule(_modulePath);
          var imageIO = new _Module.ITKImageIO();
          _Module.mountContainingDirectory(absoluteFilePath);
          imageIO.SetFileName(absoluteFilePath);
          if (imageIO.CanWriteFile(absoluteFilePath)) {
            io = ImageIOIndex[idx];
            _Module.unmountContainingDirectory(absoluteFilePath);
            break;
          }
          _Module.unmountContainingDirectory(absoluteFilePath);
        }
      }
      if (io === null) {
        reject(Error('Could not find IO for: ' + absoluteFilePath));
      }

      var modulePath = path.join(imageIOsPath, io);
      var Module = loadEmscriptenModule(modulePath);
      Module.mountContainingDirectory(absoluteFilePath);
      writeImageEmscriptenFSFile(Module, useCompression, image, absoluteFilePath);
      Module.unmountContainingDirectory(absoluteFilePath);
      resolve(null);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = writeImageLocalFile;