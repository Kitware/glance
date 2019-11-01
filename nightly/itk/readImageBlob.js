import createWebworkerPromise from './createWebworkerPromise';
import PromiseFileReader from 'promise-file-reader';
import config from './itkConfig';

var readImageBlob = function readImageBlob(webWorker, blob, fileName, mimeType) {
  var worker = webWorker;
  return createWebworkerPromise('ImageIO', worker).then(function (_ref) {
    var webworkerPromise = _ref.webworkerPromise,
        usedWorker = _ref.worker;
    worker = usedWorker;
    return PromiseFileReader.readAsArrayBuffer(blob).then(function (arrayBuffer) {
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
  });
};

export default readImageBlob;