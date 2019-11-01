import WebworkerPromise from 'webworker-promise';
import axios from 'axios';
import config from './itkConfig'; // Internal function to create a web worker promise

var createWebworkerPromise = function createWebworkerPromise(name, existingWorker) {
  if (existingWorker) {
    var _webworkerPromise = new WebworkerPromise(existingWorker);

    return Promise.resolve({
      webworkerPromise: _webworkerPromise,
      worker: existingWorker
    });
  }

  var webWorkerUrl = "".concat(config.itkModulesPath, "/WebWorkers/").concat(name, ".worker.js");

  if (webWorkerUrl.startsWith('http')) {
    return axios.get(webWorkerUrl, {
      responseType: 'blob'
    }).then(function (response) {
      var worker = new window.Worker(URL.createObjectURL(response.data) // eslint-disable-line
      );
      var webworkerPromise = new WebworkerPromise(worker);
      return {
        webworkerPromise: webworkerPromise,
        worker: worker
      };
    });
  }

  var worker = new window.Worker(webWorkerUrl);
  var webworkerPromise = new WebworkerPromise(worker);
  return Promise.resolve({
    webworkerPromise: webworkerPromise,
    worker: worker
  });
};

export default createWebworkerPromise;