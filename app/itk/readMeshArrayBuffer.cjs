"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createWebworkerPromise = _interopRequireDefault(require("./createWebworkerPromise"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readMeshArrayBuffer = (webWorker, arrayBuffer, fileName, mimeType) => {
  let worker = webWorker;
  return (0, _createWebworkerPromise.default)('MeshIO', worker).then(({
    webworkerPromise,
    worker: usedWorker
  }) => {
    worker = usedWorker;
    return webworkerPromise.postMessage({
      operation: 'readMesh',
      name: fileName,
      type: mimeType,
      data: arrayBuffer,
      config: _itkConfig.default
    }, [arrayBuffer]).then(function (mesh) {
      return Promise.resolve({
        mesh,
        webWorker: worker
      });
    });
  });
};

var _default = readMeshArrayBuffer;
exports.default = _default;