"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createWebworkerPromise = _interopRequireDefault(require("./createWebworkerPromise"));

var _promiseFileReader = _interopRequireDefault(require("promise-file-reader"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readImageBlob = (webWorker, blob, fileName, mimeType) => {
  let worker = webWorker;
  return (0, _createWebworkerPromise.default)('ImageIO', worker).then(({
    webworkerPromise,
    worker: usedWorker
  }) => {
    worker = usedWorker;
    return _promiseFileReader.default.readAsArrayBuffer(blob).then(arrayBuffer => {
      return webworkerPromise.postMessage({
        operation: 'readImage',
        name: fileName,
        type: mimeType,
        data: arrayBuffer,
        config: _itkConfig.default
      }, [arrayBuffer]);
    }).then(function (image) {
      return Promise.resolve({
        image,
        webWorker: worker
      });
    });
  });
};

var _default = readImageBlob;
exports.default = _default;