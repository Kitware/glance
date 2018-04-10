import WebworkerPromise from 'webworker-promise';
import PromiseFileReader from 'promise-file-reader';

import config from './itkConfig';

var worker = new window.Worker(config.itkModulesPath + '/WebWorkers/ImageIO.worker.js');
var promiseWorker = new WebworkerPromise(worker);

var readImageDICOMFileSeries = function readImageDICOMFileSeries(fileList) {
  var fetchFileDescriptions = Array.from(fileList, function (file) {
    return PromiseFileReader.readAsArrayBuffer(file).then(function (arrayBuffer) {
      var fileDescription = { name: file.name, type: file.type, data: arrayBuffer };
      return fileDescription;
    });
  });

  return Promise.all(fetchFileDescriptions).then(function (fileDescriptions) {
    var transferables = fileDescriptions.map(function (description) {
      return description.data;
    });
    return promiseWorker.postMessage({ operation: 'readDICOMImageSeries', fileDescriptions: fileDescriptions, config: config }, transferables);
  });
};

export default readImageDICOMFileSeries;