import WebworkerPromise from 'webworker-promise';
import PromiseFileReader from 'promise-file-reader';

import config from './itkConfig';

var worker = new window.Worker(config.itkModulesPath + '/WebWorkers/ImageIO.worker.js');
var promiseWorker = new WebworkerPromise(worker);

var readImageFile = function readImageFile(file) {
  return PromiseFileReader.readAsArrayBuffer(file).then(function (arrayBuffer) {
    return promiseWorker.postMessage({
      operation: 'readImage',
      name: file.name,
      type: file.type,
      data: arrayBuffer,
      config: config
    }, [arrayBuffer]);
  });
};

export default readImageFile;