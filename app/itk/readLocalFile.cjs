"use strict";

var path = require('path');

var getFileExtension = require('./getFileExtension.js');

var extensionToMeshIO = require('./extensionToMeshIO.js');

var extensionToPolyDataIO = require('./extensionToPolyDataIO.js');

var readImageLocalFile = require('./readImageLocalFile.js');

var readMeshLocalFileSync = require('./readMeshLocalFileSync.js');

var readPolyDataLocalFileSync = require('./readPolyDataLocalFileSync.js');
/**
 * Read an image or mesh from a file on the local filesystem in Node.js.
 *
 * @param: filePath path to the file on the local filesystem.
 */


var readLocalFile = function readLocalFile(filePath) {
  var absoluteFilePath = path.resolve(filePath);
  var extension = getFileExtension(absoluteFilePath);
  return new Promise(function (resolve, reject) {
    try {
      var isMesh = extensionToMeshIO.has(extension);
      var isPolyData = extensionToPolyDataIO.has(extension);

      if (isMesh) {
        try {
          var mesh = readMeshLocalFileSync(filePath);
          resolve(mesh);
        } catch (err) {
          // Was a .vtk image file? Continue to read as an image.
          readImageLocalFile(filePath).then(function (image) {
            resolve(image);
          });
        }
      } else if (isPolyData) {
        var polyData = readPolyDataLocalFileSync(filePath);
        resolve(polyData);
      } else {
        readImageLocalFile(filePath).then(function (image) {
          resolve(image);
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = readLocalFile;