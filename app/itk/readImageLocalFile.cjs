"use strict";

const path = require('path');

const mime = require('mime-types');

const mimeToIO = require('./MimeToImageIO.js');

const getFileExtension = require('./getFileExtension.js');

const extensionToIO = require('./extensionToImageIO.js');

const ImageIOIndex = require('./ImageIOIndex.js');

const loadEmscriptenModule = require('./loadEmscriptenModuleNode.js');

const readImageEmscriptenFSFile = require('./readImageEmscriptenFSFile.js');
/**
 * Read an image from a file on the local filesystem in Node.js.
 *
 * @param: filePath path to the file on the local filesystem.
 */


const readImageLocalFile = filePath => {
  return new Promise(function (resolve, reject) {
    const imageIOsPath = path.resolve(__dirname, 'ImageIOs');
    const absoluteFilePath = path.resolve(filePath);

    try {
      const mimeType = mime.lookup(absoluteFilePath);
      const extension = getFileExtension(absoluteFilePath);
      let io = null;

      if (mimeToIO.has(mimeType)) {
        io = mimeToIO.get(mimeType);
      } else if (extensionToIO.has(extension)) {
        io = extensionToIO.get(extension);
      } else {
        for (let idx = 0; idx < ImageIOIndex.length; ++idx) {
          const modulePath = path.join(imageIOsPath, ImageIOIndex[idx]);
          const Module = loadEmscriptenModule(modulePath);
          const imageIO = new Module.ITKImageIO();
          const mountedFilePath = Module.mountContainingDirectory(absoluteFilePath);
          imageIO.SetFileName(mountedFilePath);

          if (imageIO.CanReadFile(mountedFilePath)) {
            io = ImageIOIndex[idx];
            Module.unmountContainingDirectory(mountedFilePath);
            break;
          }

          Module.unmountContainingDirectory(mountedFilePath);
        }
      }

      if (io === null) {
        reject(Error('Could not find IO for: ' + absoluteFilePath));
      }

      const modulePath = path.join(imageIOsPath, io);
      const Module = loadEmscriptenModule(modulePath);
      const mountedFilePath = Module.mountContainingDirectory(absoluteFilePath);
      const image = readImageEmscriptenFSFile(Module, mountedFilePath);
      Module.unmountContainingDirectory(mountedFilePath);
      resolve(image);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = readImageLocalFile;