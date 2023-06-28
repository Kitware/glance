"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _writeImageArrayBuffer = _interopRequireDefault(require("./writeImageArrayBuffer"));

var _writeMeshArrayBuffer = _interopRequireDefault(require("./writeMeshArrayBuffer"));

var _getFileExtension = _interopRequireDefault(require("./getFileExtension"));

var _extensionToMeshIO = _interopRequireDefault(require("./extensionToMeshIO"));

var _MimeToMeshIO = _interopRequireDefault(require("./MimeToMeshIO"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const writeArrayBuffer = (webWorker, useCompression, imageOrMesh, fileName, mimeType) => {
  const extension = (0, _getFileExtension.default)(fileName);
  const isMesh = !!_extensionToMeshIO.default.has(extension) || !!_MimeToMeshIO.default.has(mimeType);

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