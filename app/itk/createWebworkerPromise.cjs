"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _webworkerPromise = _interopRequireDefault(require("webworker-promise"));

var _axios = _interopRequireDefault(require("axios"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Internal function to create a web worker promise
const createWebworkerPromise = (name, existingWorker) => {
  if (existingWorker) {
    const webworkerPromise = new _webworkerPromise.default(existingWorker);
    return Promise.resolve({
      webworkerPromise,
      worker: existingWorker
    });
  }

  const webWorkerUrl = `${_itkConfig.default.itkModulesPath}/WebWorkers/${name}.worker.js`;

  if (webWorkerUrl.startsWith('http')) {
    return _axios.default.get(webWorkerUrl, {
      responseType: 'blob'
    }).then(function (response) {
      const worker = new window.Worker(URL.createObjectURL(response.data) // eslint-disable-line
      );
      const webworkerPromise = new _webworkerPromise.default(worker);
      return {
        webworkerPromise,
        worker
      };
    });
  }

  const worker = new window.Worker(webWorkerUrl);
  const webworkerPromise = new _webworkerPromise.default(worker);
  return Promise.resolve({
    webworkerPromise,
    worker
  });
};

var _default = createWebworkerPromise;
exports.default = _default;