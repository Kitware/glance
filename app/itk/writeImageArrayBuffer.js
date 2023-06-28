import createWebworkerPromise from './createWebworkerPromise';
import config from './itkConfig';

var writeImageArrayBuffer = function writeImageArrayBuffer(webWorker, useCompression, image, fileName, mimeType) {
  var worker = webWorker;
  return createWebworkerPromise('ImageIO', worker).then(function (_ref) {
    var webworkerPromise = _ref.webworkerPromise,
        usedWorker = _ref.worker;
    worker = usedWorker;
    return webworkerPromise.postMessage({
      operation: 'writeImage',
      name: fileName,
      type: mimeType,
      image: image,
      useCompression: useCompression,
      config: config
    }, [image.data.buffer]).then(function (arrayBuffer) {
      return Promise.resolve({
        arrayBuffer: arrayBuffer,
        webWorker: worker
      });
    });
  });
};

export default writeImageArrayBuffer;