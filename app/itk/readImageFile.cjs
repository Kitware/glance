"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createWebworkerPromise = _interopRequireDefault(require("./createWebworkerPromise"));

var _promiseFileReader = _interopRequireDefault(require("promise-file-reader"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readImageFile = async (webWorker, file) => {
  let worker = webWorker;
  const {
    webworkerPromise,
    worker: usedWorker
  } = await (0, _createWebworkerPromise.default)('ImageIO', worker);
  worker = usedWorker;
  const arrayBuffer = await _promiseFileReader.default.readAsArrayBuffer(file);

  try {
    const image = await webworkerPromise.postMessage({
      operation: 'readImage',
      name: file.name,
      type: file.type,
      data: arrayBuffer,
      config: _itkConfig.default
    }, [arrayBuffer]);
    return {
      image,
      webWorker: worker
    };
  } catch (error) {
    throw Error(error);
  }
};

var _default = readImageFile;
exports.default = _default;