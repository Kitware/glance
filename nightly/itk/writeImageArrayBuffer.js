import createWebworkerPromise from './createWebworkerPromise';
import config from './itkConfig';
import getTransferable from './getTransferable';

var writeImageArrayBuffer = function writeImageArrayBuffer(webWorker, useCompression, image, fileName, mimeType) {
  var worker = webWorker;
  return createWebworkerPromise('ImageIO', worker).then(function (_ref) {
    var webworkerPromise = _ref.webworkerPromise,
        usedWorker = _ref.worker;
    worker = usedWorker;
    var transferables = [];
    var transferable = getTransferable(image.data);

    if (transferable) {
      transferables.push(transferable);
    }

    return webworkerPromise.postMessage({
      operation: 'writeImage',
      name: fileName,
      type: mimeType,
      image: image,
      useCompression: useCompression,
      config: config
    }, transferables).then(function (arrayBuffer) {
      return Promise.resolve({
        arrayBuffer: arrayBuffer,
        webWorker: worker
      });
    });
  });
};

export default writeImageArrayBuffer;