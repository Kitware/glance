"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createWebworkerPromise = _interopRequireDefault(require("./createWebworkerPromise"));

var _promiseFileReader = _interopRequireDefault(require("promise-file-reader"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

var readMeshBlob = function readMeshBlob(webWorker, blob, fileName, mimeType) {
  var worker = webWorker;
  return (0, _createWebworkerPromise.default)('MeshIO', worker).then(function (_ref) {
    var webworkerPromise = _ref.webworkerPromise,
        usedWorker = _ref.worker;
    worker = usedWorker;
    return _promiseFileReader.default.readAsArrayBuffer(blob).then(function (arrayBuffer) {
      return webworkerPromise.postMessage({
        operation: 'readMesh',
        name: fileName,
        type: mimeType,
        data: arrayBuffer,
        config: _itkConfig.default
      }, [arrayBuffer]);
    }).then(function (mesh) {
      return Promise.resolve({
        mesh: mesh,
        webWorker: worker
      });
    });
  });
};

var _default = readMeshBlob;
exports.default = _default;