import WebworkerPromise from 'webworker-promise';

import config from './itkConfig';

var readImageArrayBuffer = function readImageArrayBuffer(webWorker, arrayBuffer, fileName, mimeType) {
  var worker = webWorker;
  if (!worker) {
    worker = new window.Worker(config.itkModulesPath + '/WebWorkers/ImageIO.worker.js');
  }
  var promiseWorker = new WebworkerPromise(worker);
  return promiseWorker.postMessage({
    operation: 'readImage',
    name: fileName,
    type: mimeType,
    data: arrayBuffer,
    config: config
  }, [arrayBuffer]).then(function (image) {
    return Promise.resolve({ image: image, webWorker: worker });
  });
};

export default readImageArrayBuffer;