import WebworkerPromise from 'webworker-promise';
import PromiseFileReader from 'promise-file-reader';

import config from './itkConfig';

var readMeshFile = function readMeshFile(webWorker, file) {
  var worker = webWorker;
  if (!worker) {
    worker = new window.Worker(config.itkModulesPath + '/WebWorkers/MeshIO.worker.js');
  }
  var promiseWorker = new WebworkerPromise(worker);
  return PromiseFileReader.readAsArrayBuffer(file).then(function (arrayBuffer) {
    return promiseWorker.postMessage({
      operation: 'readMesh',
      name: file.name,
      type: file.type,
      data: arrayBuffer,
      config: config
    }, [arrayBuffer]);
  }).then(function (mesh) {
    return Promise.resolve({ mesh: mesh, webWorker: worker });
  });
};

export default readMeshFile;