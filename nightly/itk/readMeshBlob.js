import WebworkerPromise from 'webworker-promise';
import PromiseFileReader from 'promise-file-reader';

import config from './itkConfig';

var worker = new window.Worker(config.itkModulesPath + '/WebWorkers/MeshIO.worker.js');
var promiseWorker = new WebworkerPromise(worker);

var readMeshBlob = function readMeshBlob(blob, fileName, mimeType) {
  return PromiseFileReader.readAsArrayBuffer(blob).then(function (arrayBuffer) {
    return promiseWorker.postMessage({ operation: 'readMesh', name: fileName, type: mimeType, data: arrayBuffer, config: config }, [arrayBuffer]);
  });
};

export default readMeshBlob;