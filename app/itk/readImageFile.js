import createWebworkerPromise from './createWebworkerPromise';
import PromiseFileReader from 'promise-file-reader';
import config from './itkConfig';

var readImageFile = function readImageFile(webWorker, file) {
  var worker = webWorker;
  return createWebworkerPromise('ImageIO', worker).then(function (_ref) {
    var webworkerPromise = _ref.webworkerPromise,
        usedWorker = _ref.worker;
    worker = usedWorker;
    return PromiseFileReader.readAsArrayBuffer(file).then(function (arrayBuffer) {
      return webworkerPromise.postMessage({
        operation: 'readImage',
        name: file.name,
        type: file.type,
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

export default readImageFile;