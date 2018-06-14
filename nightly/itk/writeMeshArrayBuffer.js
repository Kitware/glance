import createWebworkerPromise from './createWebworkerPromise';

import config from './itkConfig';

var writeMeshArrayBuffer = function writeMeshArrayBuffer(webWorker, _ref, mesh, fileName, mimeType) {
  var useCompression = _ref.useCompression,
      binaryFileType = _ref.binaryFileType;

  var worker = webWorker;
  return createWebworkerPromise('MeshIO', worker).then(function (_ref2) {
    var webworkerPromise = _ref2.webworkerPromise,
        usedWorker = _ref2.worker;

    worker = usedWorker;
    var transferables = [];
    if (mesh.points.buffer) {
      transferables.push(mesh.points.buffer);
    } else if (mesh.points.byteLength) {
      transferables.push(mesh.points);
    }
    if (mesh.pointData.buffer) {
      transferables.push(mesh.pointData.buffer);
    } else if (mesh.pointData.byteLength) {
      transferables.push(mesh.pointData);
    }
    if (mesh.cells.buffer) {
      transferables.push(mesh.cells.buffer);
    } else if (mesh.cells.byteLength) {
      transferables.push(mesh.cells);
    }
    if (mesh.cellData.buffer) {
      transferables.push(mesh.cellData.buffer);
    } else if (mesh.cellData.byteLength) {
      transferables.push(mesh.cellData);
    }
    return webworkerPromise.postMessage({
      operation: 'writeMesh',
      name: fileName,
      type: mimeType,
      mesh: mesh,
      useCompression: useCompression,
      binaryFileType: binaryFileType,
      config: config
    }, transferables).then(function () {
      return Promise.resolve({ webWorker: worker });
    });
  });
};

export default writeMeshArrayBuffer;