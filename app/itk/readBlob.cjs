"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _readImageBlob = _interopRequireDefault(require("./readImageBlob"));

var _readMeshBlob = _interopRequireDefault(require("./readMeshBlob"));

var _getFileExtension = _interopRequireDefault(require("./getFileExtension"));

var _extensionToMeshIO = _interopRequireDefault(require("./extensionToMeshIO"));

var _MimeToMeshIO = _interopRequireDefault(require("./MimeToMeshIO"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readBlob = (webWorker, blob, fileName, mimeType) => {
  const extension = (0, _getFileExtension.default)(fileName);
  const isMesh = !!_extensionToMeshIO.default.has(extension) || !!_MimeToMeshIO.default.has(mimeType);

  if (isMesh) {
    return (0, _readMeshBlob.default)(webWorker, blob, fileName, mimeType).catch(function () {
      webWorker.terminate();
      return (0, _readImageBlob.default)(null, blob, fileName, mimeType);
    });
  } else {
    return (0, _readImageBlob.default)(webWorker, blob, fileName, mimeType);
  }
};

var _default = readBlob;
exports.default = _default;