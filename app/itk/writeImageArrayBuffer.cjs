"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createWebworkerPromise = _interopRequireDefault(require("./createWebworkerPromise"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

var _getTransferable = _interopRequireDefault(require("./getTransferable"));

var writeImageArrayBuffer = function writeImageArrayBuffer(webWorker, useCompression, image, fileName, mimeType) {
  var worker = webWorker;
  return (0, _createWebworkerPromise.default)('ImageIO', worker).then(function (_ref) {
    var webworkerPromise = _ref.webworkerPromise,
        usedWorker = _ref.worker;
    worker = usedWorker;
    var transferables = [];
    var transferable = (0, _getTransferable.default)(image.data);

    if (transferable) {
      transferables.push(transferable);
    }

    return webworkerPromise.postMessage({
      operation: 'writeImage',
      name: fileName,
      type: mimeType,
      image: image,
      useCompression: useCompression,
      config: _itkConfig.default
    }, transferables).then(function (arrayBuffer) {
      return Promise.resolve({
        arrayBuffer: arrayBuffer,
        webWorker: worker
      });
    });
  });
};

var _default = writeImageArrayBuffer;
exports.default = _default;