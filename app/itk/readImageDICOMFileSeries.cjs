"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));

var _createWebworkerPromise = _interopRequireDefault(require("./createWebworkerPromise"));

var _promiseFileReader = _interopRequireDefault(require("promise-file-reader"));

var _WorkerPool = _interopRequireDefault(require("./WorkerPool"));

var _stackImages = _interopRequireDefault(require("./stackImages"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable-next-line no-unused-vars */
const workerFunction = async (webWorker, fileDescriptions, singleSortedSeries = false) => {
  let worker = webWorker;
  const {
    webworkerPromise,
    worker: usedWorker
  } = await (0, _createWebworkerPromise.default)('ImageIO', worker);
  worker = usedWorker;
  const transferables = fileDescriptions.map(description => {
    return description.data;
  });
  const message = {
    operation: 'readDICOMImageSeries',
    fileDescriptions: fileDescriptions,
    singleSortedSeries,
    config: _itkConfig.default
  };
  const image = await webworkerPromise.postMessage(message, transferables);
  return {
    image,
    webWorker: worker
  };
};

const numberOfWorkers = navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4;
const workerPool = new _WorkerPool.default(numberOfWorkers, workerFunction);
const seriesBlockSize = 8;

const readImageDICOMFileSeries = async (fileList, singleSortedSeries = false) => {
  const fetchFileDescriptions = Array.from(fileList, function (file) {
    return _promiseFileReader.default.readAsArrayBuffer(file).then(function (arrayBuffer) {
      const fileDescription = {
        name: file.name,
        type: file.type,
        data: arrayBuffer
      };
      return fileDescription;
    });
  });
  const fileDescriptions = await Promise.all(fetchFileDescriptions);

  if (singleSortedSeries) {
    const taskArgsArray = [];

    for (let index = 0; index < fileDescriptions.length; index += seriesBlockSize) {
      const block = fileDescriptions.slice(index, index + seriesBlockSize);
      taskArgsArray.push([block, singleSortedSeries]);
    }

    const results = await workerPool.runTasks(taskArgsArray);
    const images = results.map(result => result.image);
    const stacked = (0, _stackImages.default)(images);
    return {
      image: stacked,
      webWorkerPool: workerPool
    };
  } else {
    const taskArgsArray = [[fileDescriptions, singleSortedSeries]];
    const results = await workerPool.runTasks(taskArgsArray);
    return {
      image: results[0].image,
      webWorkerPool: workerPool
    };
  }
};

var _default = readImageDICOMFileSeries;
exports.default = _default;