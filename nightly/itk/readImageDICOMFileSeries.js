import createWebworkerPromise from './createWebworkerPromise';
import PromiseFileReader from 'promise-file-reader';
import config from './itkConfig';

var readImageDICOMFileSeries = function readImageDICOMFileSeries(webWorker, fileList) {
  var worker = webWorker;
  return createWebworkerPromise('ImageIO', worker).then(function (_ref) {
    var webworkerPromise = _ref.webworkerPromise,
        usedWorker = _ref.worker;
    worker = usedWorker;
    var fetchFileDescriptions = Array.from(fileList, function (file) {
      return PromiseFileReader.readAsArrayBuffer(file).then(function (arrayBuffer) {
        var fileDescription = {
          name: file.name,
          type: file.type,
          data: arrayBuffer
        };
        return fileDescription;
      });
    });
    return Promise.all(fetchFileDescriptions).then(function (fileDescriptions) {
      var transferables = fileDescriptions.map(function (description) {
        return description.data;
      });
      return webworkerPromise.postMessage({
        operation: 'readDICOMImageSeries',
        fileDescriptions: fileDescriptions,
        config: config
      }, transferables);
    }).then(function (image) {
      return Promise.resolve({
        image: image,
        webWorker: worker
      });
    });
  });
};

export default readImageDICOMFileSeries;