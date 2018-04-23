import WebworkerPromise from 'webworker-promise';
import PromiseFileReader from 'promise-file-reader';

import config from './itkConfig';

var readMeshBlob = function readMeshBlob(webWorker, blob, fileName, mimeType) {
  var worker = webWorker;
  if (!worker) {
    worker = new window.Worker(config.itkModulesPath + '/WebWorkers/MeshIO.worker.js');
  }
  var promiseWorker = new WebworkerPromise(worker);
  return PromiseFileReader.readAsArrayBuffer(blob).then(function (arrayBuffer) {
    return promiseWorker.postMessage({ operation: 'readMesh', name: fileName, type: mimeType, data: arrayBuffer, config: config }, [arrayBuffer]);
  }).then(function (mesh) {
    return Promise.resolve({ mesh: mesh, webWorker: worker });
  });
};

export default readMeshBlob;