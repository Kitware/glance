"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _webworkerPromise2 = _interopRequireDefault(require("webworker-promise"));

var _axios = _interopRequireDefault(require("axios"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

// Internal function to create a web worker promise
var createWebworkerPromise = function createWebworkerPromise(name, existingWorker) {
  if (existingWorker) {
    var _webworkerPromise = new _webworkerPromise2.default(existingWorker);

    return Promise.resolve({
      webworkerPromise: _webworkerPromise,
      worker: existingWorker
    });
  }

  var webWorkerUrl = "".concat(_itkConfig.default.itkModulesPath, "/WebWorkers/").concat(name, ".worker.js");

  if (webWorkerUrl.startsWith('http')) {
    return _axios.default.get(webWorkerUrl, {
      responseType: 'blob'
    }).then(function (response) {
      var worker = new window.Worker(URL.createObjectURL(response.data) // eslint-disable-line
      );
      var webworkerPromise = new _webworkerPromise2.default(worker);
      return {
        webworkerPromise: webworkerPromise,
        worker: worker
      };
    });
  }

  var worker = new window.Worker(webWorkerUrl);
  var webworkerPromise = new _webworkerPromise2.default(worker);
  return Promise.resolve({
    webworkerPromise: webworkerPromise,
    worker: worker
  });
};

var _default = createWebworkerPromise;
exports.default = _default;