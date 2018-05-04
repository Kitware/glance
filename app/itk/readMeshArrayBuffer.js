import WebworkerPromise from 'webworker-promise';

import config from './itkConfig';

var readMeshArrayBuffer = function readMeshArrayBuffer(webWorker, arrayBuffer, fileName, mimeType) {
  var worker = webWorker;
  if (!worker) {
    worker = new window.Worker(config.itkModulesPath + '/WebWorkers/MeshIO.worker.js');
  }
  var promiseWorker = new WebworkerPromise(worker);
  return promiseWorker.postMessage({
    operation: 'readMesh',
    name: fileName,
    type: mimeType,
    data: arrayBuffer,
    config: config
  }, [arrayBuffer]).then(function (mesh) {
    return Promise.resolve({ mesh: mesh, webWorker: worker });
  });
};

export default readMeshArrayBuffer;