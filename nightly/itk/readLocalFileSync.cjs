"use strict";

const path = require('path');

const getFileExtension = require('./getFileExtension.js');

const extensionToMeshIO = require('./extensionToMeshIO.js');

const extensionToPolyDataIO = require('./extensionToPolyDataIO.js');

const readImageLocalFileSync = require('./readImageLocalFileSync.js');

const readMeshLocalFileSync = require('./readMeshLocalFileSync.js');

const readPolyDataLocalFileSync = require('./readPolyDataLocalFileSync.js');
/**
 * Read an image or mesh from a file on the local filesystem in Node.js.
 *
 * @param: filePath path to the file on the local filesystem.
 */


const readLocalFileSync = filePath => {
  const absoluteFilePath = path.resolve(filePath);
  const extension = getFileExtension(absoluteFilePath);
  const isMesh = extensionToMeshIO.has(extension);
  const isPolyData = extensionToPolyDataIO.has(extension);

  if (isMesh) {
    try {
      const mesh = readMeshLocalFileSync(filePath);
      return mesh;
    } catch (err) {
      // Was a .vtk image file? Continue to read as an image.
      const image = readImageLocalFileSync(filePath);
      return image;
    }
  } else if (isPolyData) {
    const polyData = readPolyDataLocalFileSync(filePath);
    return polyData;
  } else {
    const image = readImageLocalFileSync(filePath);
    return image;
  }
};

module.exports = readLocalFileSync;