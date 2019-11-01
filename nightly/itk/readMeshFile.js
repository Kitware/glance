import createWebworkerPromise from './createWebworkerPromise';
import PromiseFileReader from 'promise-file-reader';
import config from './itkConfig';

var readMeshFile = function readMeshFile(webWorker, file) {
  var worker = webWorker;
  return createWebworkerPromise('MeshIO', worker).then(function (_ref) {
    var webworkerPromise = _ref.webworkerPromise,
        usedWorker = _ref.worker;
    worker = usedWorker;
    return PromiseFileReader.readAsArrayBuffer(file).then(function (arrayBuffer) {
      return webworkerPromise.postMessage({
        operation: 'readMesh',
        name: file.name,
        type: file.type,
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

export default readMeshFile;