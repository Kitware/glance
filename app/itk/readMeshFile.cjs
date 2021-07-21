"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createWebworkerPromise = _interopRequireDefault(require("./createWebworkerPromise"));

var _promiseFileReader = _interopRequireDefault(require("promise-file-reader"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readMeshFile = (webWorker, file) => {
  let worker = webWorker;
  return (0, _createWebworkerPromise.default)('MeshIO', worker).then(({
    webworkerPromise,
    worker: usedWorker
  }) => {
    worker = usedWorker;
    return _promiseFileReader.default.readAsArrayBuffer(file).then(arrayBuffer => {
      return webworkerPromise.postMessage({
        operation: 'readMesh',
        name: file.name,
        type: file.type,
        data: arrayBuffer,
        config: _itkConfig.default
      }, [arrayBuffer]);
    }).then(function (mesh) {
      return Promise.resolve({
        mesh,
        webWorker: worker
      });
    });
  });
};

var _default = readMeshFile;
exports.default = _default;