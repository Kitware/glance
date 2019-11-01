import createWebworkerPromise from './createWebworkerPromise';
import config from './itkConfig';

var readImageArrayBuffer = function readImageArrayBuffer(webWorker, arrayBuffer, fileName, mimeType) {
  var worker = webWorker;
  return createWebworkerPromise('ImageIO', worker).then(function (_ref) {
    var webworkerPromise = _ref.webworkerPromise,
        usedWorker = _ref.worker;
    worker = usedWorker;
    return webworkerPromise.postMessage({
      operation: 'readImage',
      name: fileName,
      type: mimeType,
      data: arrayBuffer,
      config: config
    }, [arrayBuffer]);
  }).then(function (image) {
    return Promise.resolve({
      image: image,
      webWorker: worker
    });
  });
};

export default readImageArrayBuffer;