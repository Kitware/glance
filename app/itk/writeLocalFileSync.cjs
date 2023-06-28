"use strict";

const path = require('path');

const getFileExtension = require('./getFileExtension.js');

const extensionToMeshIO = require('./extensionToMeshIO.js');

const writeImageLocalFileSync = require('./writeImageLocalFileSync.js');

const writeMeshLocalFileSync = require('./writeMeshLocalFileSync.js');
/**
 * Write an image or mesh to a file on the local filesystem in Node.js.
 *
 * @param: useCompression compression the pixel data when possible
 * @param: imageOrMesh itk.Image or itk.Mesh instance to write
 * @param: filePath path to the file on the local filesystem.
 *
 * @return empty Promise
 */


const writeLocalFileSync = (useCompression, imageOrMesh, filePath) => {
  const absoluteFilePath = path.resolve(filePath);
  const extension = getFileExtension(absoluteFilePath);
  const isMesh = extensionToMeshIO.has(extension);

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