import WebworkerPromise from 'webworker-promise';
import PromiseFileReader from 'promise-file-reader';

import config from './itkConfig';

var worker = new window.Worker(config.itkModulesPath + '/WebWorkers/MeshIO.worker.js');
var promiseWorker = new WebworkerPromise(worker);

var readMeshFile = function readMeshFile(file) {
  return PromiseFileReader.readAsArrayBuffer(file).then(function (arrayBuffer) {
    return promiseWorker.postMessage({
      operation: 'readMesh',
      name: file.name,
      type: file.type,
      data: arrayBuffer,
      config: config
    }, [arrayBuffer]);
  });
};

export default readMeshFile;