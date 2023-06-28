"use strict";

const path = require('path');

const getFileExtension = require('./getFileExtension.js');

const extensionToMeshIO = require('./extensionToMeshIO.js');

const extensionToPolyDataIO = require('./extensionToPolyDataIO.js');

const readImageLocalFile = require('./readImageLocalFile.js');

const readMeshLocalFileSync = require('./readMeshLocalFileSync.js');

const readPolyDataLocalFileSync = require('./readPolyDataLocalFileSync.js');
/**
 * Read an image or mesh from a file on the local filesystem in Node.js.
 *
 * @param: filePath path to the file on the local filesystem.
 */


const readLocalFile = filePath => {
  const absoluteFilePath = path.resolve(filePath);
  const extension = getFileExtension(absoluteFilePath);
  return new Promise(function (resolve, reject) {
    try {
      const isMesh = extensionToMeshIO.has(extension);
      const isPolyData = extensionToPolyDataIO.has(extension);

      if (isMesh) {
        try {
          const mesh = readMeshLocalFileSync(filePath);
          resolve(mesh);
        } catch (err) {
          // Was a .vtk image file? Continue to read as an image.
          readImageLocalFile(filePath).then(image => {
            resolve(image);
          });
        }
      } else if (isPolyData) {
        const polyData = readPolyDataLocalFileSync(filePath);
        resolve(polyData);
      } else {
        readImageLocalFile(filePath).then(image => {
          resolve(image);
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = readLocalFile;