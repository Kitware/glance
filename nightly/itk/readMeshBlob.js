import createWebworkerPromise from './createWebworkerPromise';
import PromiseFileReader from 'promise-file-reader';
import config from './itkConfig';

var readMeshBlob = function readMeshBlob(webWorker, blob, fileName, mimeType) {
  var worker = webWorker;
  return createWebworkerPromise('MeshIO', worker).then(function (_ref) {
    var webworkerPromise = _ref.webworkerPromise,
        usedWorker = _ref.worker;
    worker = usedWorker;
    return PromiseFileReader.readAsArrayBuffer(blob).then(function (arrayBuffer) {
      return webworkerPromise.postMessage({
        operation: 'readMesh',
        name: fileName,
        type: mimeType,
        data: arrayBuffer,
        config: config
      }, [arrayBuffer]);
    }).then(function (mesh) {
      return Promise.resolve({
        mesh: mesh,
        webWorker: worker
      });
    });
  });
};

export default readMeshBlob;