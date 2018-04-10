import WebworkerPromise from 'webworker-promise';

import config from './itkConfig';

var worker = new window.Worker(config.itkModulesPath + '/WebWorkers/MeshIO.worker.js');
var promiseWorker = new WebworkerPromise(worker);

var readMeshArrayBuffer = function readMeshArrayBuffer(arrayBuffer, fileName, mimeType) {
  return promiseWorker.postMessage({
    operation: 'readMesh',
    name: fileName,
    type: mimeType,
    data: arrayBuffer,
    config: config
  }, [arrayBuffer]);
};

export default readMeshArrayBuffer;