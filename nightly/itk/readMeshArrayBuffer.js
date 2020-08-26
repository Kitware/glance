import createWebworkerPromise from './createWebworkerPromise';
import config from './itkConfig';

var readMeshArrayBuffer = function readMeshArrayBuffer(webWorker, arrayBuffer, fileName, mimeType) {
  var worker = webWorker;
  return createWebworkerPromise('MeshIO', worker).then(function (_ref) {
    var webworkerPromise = _ref.webworkerPromise,
        usedWorker = _ref.worker;
    worker = usedWorker;
    return webworkerPromise.postMessage({
      operation: 'readMesh',
      name: fileName,
      type: mimeType,
      data: arrayBuffer,
      config: config
    }, [arrayBuffer]).then(function (mesh) {
      return Promise.resolve({
        mesh: mesh,
        webWorker: worker
      });
    });
  });
};

export default readMeshArrayBuffer;