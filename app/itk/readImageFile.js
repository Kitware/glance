import WebworkerPromise from 'webworker-promise';
import PromiseFileReader from 'promise-file-reader';

import config from './itkConfig';

var readImageFile = function readImageFile(webWorker, file) {
  var worker = webWorker;
  if (!worker) {
    worker = new window.Worker(config.itkModulesPath + '/WebWorkers/ImageIO.worker.js');
  }
  var promiseWorker = new WebworkerPromise(worker);
  return PromiseFileReader.readAsArrayBuffer(file).then(function (arrayBuffer) {
    return promiseWorker.postMessage({
      operation: 'readImage',
      name: file.name,
      type: file.type,
      data: arrayBuffer,
      config: config
    }, [arrayBuffer]);
  }).then(function (image) {
    return Promise.resolve({ image: image, webWorker: worker });
  });
};

export default readImageFile;