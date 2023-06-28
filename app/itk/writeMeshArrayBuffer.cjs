"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createWebworkerPromise = _interopRequireDefault(require("./createWebworkerPromise"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const writeMeshArrayBuffer = (webWorker, {
  useCompression,
  binaryFileType
}, mesh, fileName, mimeType) => {
  let worker = webWorker;
  return (0, _createWebworkerPromise.default)('MeshIO', worker).then(({
    webworkerPromise,
    worker: usedWorker
  }) => {
    worker = usedWorker;
    const transferables = [];

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
      mesh,
      useCompression,
      binaryFileType,
      config: _itkConfig.default
    }, transferables).then(function (arrayBuffer) {
      return Promise.resolve({
        arrayBuffer,
        webWorker: worker
      });
    });
  });
};

var _default = writeMeshArrayBuffer;
exports.default = _default;