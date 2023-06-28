"use strict";

const path = require('path');

const mime = require('mime-types');

const mimeToIO = require('./MimeToMeshIO.js');

const getFileExtension = require('./getFileExtension.js');

const extensionToIO = require('./extensionToMeshIO.js');

const MeshIOIndex = require('./MeshIOIndex.js');

const loadEmscriptenModule = require('./loadEmscriptenModuleNode.js');

const writeMeshEmscriptenFSFile = require('./writeMeshEmscriptenFSFile.js');
/**
 * Write a mesh to a file on the local filesystem in Node.js.
 *
 * @param: useCompression compression the pixel data when possible
 * @param: binaryFileType write in an binary as opposed to a ascii format, if
 * possible
 * @param: mesh itk.Mesh instance to write
 * @param: filePath path to the file on the local filesystem.
 *
 * @return null
 */


const writeMeshLocalFileSync = ({
  useCompression,
  binaryFileType
}, mesh, filePath) => {
  const meshIOsPath = path.resolve(__dirname, 'MeshIOs');
  const absoluteFilePath = path.resolve(filePath);
  const mimeType = mime.lookup(absoluteFilePath);
  const extension = getFileExtension(absoluteFilePath);
  let io = null;

  if (mimeToIO.has(mimeType)) {
    io = mimeToIO.get(mimeType);
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension);
  } else {
    for (let idx = 0; idx < MeshIOIndex.length; ++idx) {
      const modulePath = path.join(meshIOsPath, MeshIOIndex[idx]);
      const Module = loadEmscriptenModule(modulePath);
      const meshIO = new Module.ITKMeshIO();
      const mountedFilePath = Module.mountContainingDirectory(absoluteFilePath);
      meshIO.SetFileName(mountedFilePath);

      if (meshIO.CanWriteFile(mountedFilePath)) {
        io = MeshIOIndex[idx];
        Module.unmountContainingDirectory(mountedFilePath);
        break;
      }

      Module.unmountContainingDirectory(mountedFilePath);
    }
  }

  if (io === null) {
    throw Error('Could not find IO for: ' + absoluteFilePath);
  }

  const modulePath = path.join(meshIOsPath, io);
  const Module = loadEmscriptenModule(modulePath);
  const mountedFilePath = Module.mountContainingDirectory(absoluteFilePath);
  writeMeshEmscriptenFSFile(Module, {
    useCompression,
    binaryFileType
  }, mesh, mountedFilePath);
  Module.unmountContainingDirectory(mountedFilePath);
  return null;
};

module.exports = writeMeshLocalFileSync;