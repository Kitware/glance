import WebworkerPromise from 'webworker-promise';
import PromiseFileReader from 'promise-file-reader';

import config from './itkConfig';

var readImageBlob = function readImageBlob(webWorker, blob, fileName, mimeType) {
  var worker = webWorker;
  if (!worker) {
    worker = new window.Worker(config.itkModulesPath + '/WebWorkers/ImageIO.worker.js');
  }
  var promiseWorker = new WebworkerPromise(worker);
  return PromiseFileReader.readAsArrayBuffer(blob).then(function (arrayBuffer) {
    return promiseWorker.postMessage({
      operation: 'readImage',
      name: fileName,
      type: mimeType,
      data: arrayBuffer,
      config: config
    }, [arrayBuffer]);
  }).then(function (image) {
    return Promise.resolve({ image: image, webWorker: worker });
  });
};

export default readImageBlob;