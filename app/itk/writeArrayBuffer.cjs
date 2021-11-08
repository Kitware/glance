"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _writeImageArrayBuffer = _interopRequireDefault(require("./writeImageArrayBuffer"));

var _writeMeshArrayBuffer = _interopRequireDefault(require("./writeMeshArrayBuffer"));

var _getFileExtension = _interopRequireDefault(require("./getFileExtension"));

var _extensionToMeshIO = _interopRequireDefault(require("./extensionToMeshIO"));

var _MimeToMeshIO = _interopRequireDefault(require("./MimeToMeshIO"));

var writeArrayBuffer = function writeArrayBuffer(webWorker, useCompression, imageOrMesh, fileName, mimeType) {
  var extension = (0, _getFileExtension.default)(fileName);
  var isMesh = !!_extensionToMeshIO.default.has(extension) || !!_MimeToMeshIO.default.has(mimeType);

  if (isMesh) {
    return (0, _writeMeshArrayBuffer.default)(webWorker, useCompression, imageOrMesh, fileName, mimeType).catch(function () {
      webWorker.terminate();
      return (0, _writeImageArrayBuffer.default)(null, useCompression, imageOrMesh, fileName, mimeType);
    });
  } else {
    return (0, _writeImageArrayBuffer.default)(webWorker, useCompression, imageOrMesh, fileName, mimeType);
  }
};

var _default = writeArrayBuffer;
exports.default = _default;