import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

/* eslint-disable-next-line no-unused-vars */
import regeneratorRuntime from 'regenerator-runtime';
import createWebworkerPromise from './createWebworkerPromise';
import PromiseFileReader from 'promise-file-reader';
import WorkerPool from './WorkerPool';
import stackImages from './stackImages';
import config from './itkConfig';

var workerFunction = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(webWorker, fileDescriptions) {
    var singleSortedSeries,
        worker,
        _yield$createWebworke,
        webworkerPromise,
        usedWorker,
        transferables,
        message,
        image,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            singleSortedSeries = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
            worker = webWorker;
            _context.next = 4;
            return createWebworkerPromise('ImageIO', worker);

          case 4:
            _yield$createWebworke = _context.sent;
            webworkerPromise = _yield$createWebworke.webworkerPromise;
            usedWorker = _yield$createWebworke.worker;
            worker = usedWorker;
            transferables = fileDescriptions.map(function (description) {
              return description.data;
            });
            message = {
              operation: 'readDICOMImageSeries',
              fileDescriptions: fileDescriptions,
              singleSortedSeries: singleSortedSeries,
              config: config
            };
            _context.next = 12;
            return webworkerPromise.postMessage(message, transferables);

          case 12:
            image = _context.sent;
            return _context.abrupt("return", {
              image: image,
              webWorker: worker
            });

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function workerFunction(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var numberOfWorkers = navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4;
var workerPool = new WorkerPool(numberOfWorkers, workerFunction);
var seriesBlockSize = 8;

var readImageDICOMFileSeries = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(fileList) {
    var singleSortedSeries,
        fetchFileDescriptions,
        fileDescriptions,
        taskArgsArray,
        index,
        block,
        results,
        images,
        stacked,
        _taskArgsArray,
        _results,
        _args2 = arguments;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            singleSortedSeries = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : false;
            fetchFileDescriptions = Array.from(fileList, function (file) {
              return PromiseFileReader.readAsArrayBuffer(file).then(function (arrayBuffer) {
                var fileDescription = {
                  name: file.name,
                  type: file.type,
                  data: arrayBuffer
                };
                return fileDescription;
              });
            });
            _context2.next = 4;
            return Promise.all(fetchFileDescriptions);

          case 4:
            fileDescriptions = _context2.sent;

            if (!singleSortedSeries) {
              _context2.next = 16;
              break;
            }

            taskArgsArray = [];

            for (index = 0; index < fileDescriptions.length; index += seriesBlockSize) {
              block = fileDescriptions.slice(index, index + seriesBlockSize);
              taskArgsArray.push([block, singleSortedSeries]);
            }

            _context2.next = 10;
            return workerPool.runTasks(taskArgsArray).promise;

          case 10:
            results = _context2.sent;
            images = results.map(function (result) {
              return result.image;
            });
            stacked = stackImages(images);
            return _context2.abrupt("return", {
              image: stacked,
              webWorkerPool: workerPool
            });

          case 16:
            _taskArgsArray = [[fileDescriptions, singleSortedSeries]];
            _context2.next = 19;
            return workerPool.runTasks(_taskArgsArray).promise;

          case 19:
            _results = _context2.sent;
            return _context2.abrupt("return", {
              image: _results[0].image,
              webWorkerPool: workerPool
            });

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function readImageDICOMFileSeries(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

export default readImageDICOMFileSeries;