"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createWebworkerPromise = _interopRequireDefault(require("./createWebworkerPromise"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const writeImageArrayBuffer = (webWorker, useCompression, image, fileName, mimeType) => {
  let worker = webWorker;
  return (0, _createWebworkerPromise.default)('ImageIO', worker).then(({
    webworkerPromise,
    worker: usedWorker
  }) => {
    worker = usedWorker;
    return webworkerPromise.postMessage({
      operation: 'writeImage',
      name: fileName,
      type: mimeType,
      image: image,
      useCompression: useCompression,
      config: _itkConfig.default
    }, [image.data.buffer]).then(function (arrayBuffer) {
      return Promise.resolve({
        arrayBuffer,
        webWorker: worker
      });
    });
  });
};

var _default = writeImageArrayBuffer;
exports.default = _default;