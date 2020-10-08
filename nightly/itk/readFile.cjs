"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _readImageFile = _interopRequireDefault(require("./readImageFile"));

var _readMeshFile = _interopRequireDefault(require("./readMeshFile"));

var _readPolyDataFile = _interopRequireDefault(require("./readPolyDataFile"));

var _getFileExtension = _interopRequireDefault(require("./getFileExtension"));

var _extensionToMeshIO = _interopRequireDefault(require("./extensionToMeshIO"));

var _extensionToPolyDataIO = _interopRequireDefault(require("./extensionToPolyDataIO"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readFile = (webWorker, file) => {
  const extension = (0, _getFileExtension.default)(file.name);

  const isMesh = _extensionToMeshIO.default.has(extension);

  const isPolyData = _extensionToPolyDataIO.default.has(extension);

  if (isMesh) {
    return (0, _readMeshFile.default)(webWorker, file).catch(function () {
      webWorker.terminate();
      return (0, _readImageFile.default)(null, file);
    });
  } else if (isPolyData) {
    return (0, _readPolyDataFile.default)(webWorker, file);
  } else {
    return (0, _readImageFile.default)(webWorker, file);
  }
};

var _default = readFile;
exports.default = _default;