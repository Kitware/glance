"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createWebworkerPromise = _interopRequireDefault(require("./createWebworkerPromise"));

var _promiseFileReader = _interopRequireDefault(require("promise-file-reader"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

var readImageBlob = function readImageBlob(webWorker, blob, fileName, mimeType) {
  var worker = webWorker;
  return (0, _createWebworkerPromise.default)('ImageIO', worker).then(function (_ref) {
    var webworkerPromise = _ref.webworkerPromise,
        usedWorker = _ref.worker;
    worker = usedWorker;
    return _promiseFileReader.default.readAsArrayBuffer(blob).then(function (arrayBuffer) {
      return webworkerPromise.postMessage({
        operation: 'readImage',
        name: fileName,
        type: mimeType,
        data: arrayBuffer,
        config: _itkConfig.default
      }, [arrayBuffer]);
    }).then(function (image) {
      return Promise.resolve({
        image: image,
        webWorker: worker
      });
    });
  });
};

var _default = readImageBlob;
exports.default = _default;