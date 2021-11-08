"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createWebworkerPromise = _interopRequireDefault(require("./createWebworkerPromise"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

var writeMeshArrayBuffer = function writeMeshArrayBuffer(webWorker, _ref, mesh, fileName, mimeType) {
  var useCompression = _ref.useCompression,
      binaryFileType = _ref.binaryFileType;
  var worker = webWorker;
  return (0, _createWebworkerPromise.default)('MeshIO', worker).then(function (_ref2) {
    var webworkerPromise = _ref2.webworkerPromise,
        usedWorker = _ref2.worker;
    worker = usedWorker;
    var transferables = [];

    if (mesh.points) {
      transferables.push(mesh.points.buffer);
    }

    if (mesh.pointData) {
      transferables.push(mesh.pointData.buffer);
    }

    if (mesh.cells) {
      transferables.push(mesh.cells.buffer);
    }

    if (mesh.cellData) {
      transferables.push(mesh.cellData.buffer);
    }

    return webworkerPromise.postMessage({
      operation: 'writeMesh',
      name: fileName,
      type: mimeType,
      mesh: mesh,
      useCompression: useCompression,
      binaryFileType: binaryFileType,
      config: _itkConfig.default
    }, transferables).then(function (arrayBuffer) {
      return Promise.resolve({
        arrayBuffer: arrayBuffer,
        webWorker: worker
      });
    });
  });
};

var _default = writeMeshArrayBuffer;
exports.default = _default;