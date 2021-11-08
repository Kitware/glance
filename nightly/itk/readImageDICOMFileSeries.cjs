"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));

var _createWebworkerPromise = _interopRequireDefault(require("./createWebworkerPromise"));

var _promiseFileReader = _interopRequireDefault(require("promise-file-reader"));

var _WorkerPool = _interopRequireDefault(require("./WorkerPool"));

var _stackImages = _interopRequireDefault(require("./stackImages"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

/* eslint-disable-next-line no-unused-vars */
var workerFunction = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee(webWorker, fileDescriptions) {
    var singleSortedSeries,
        worker,
        _yield$createWebworke,
        webworkerPromise,
        usedWorker,
        transferables,
        message,
        image,
        _args = arguments;

    return _regeneratorRuntime.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            singleSortedSeries = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
            worker = webWorker;
            _context.next = 4;
            return (0, _createWebworkerPromise.default)('ImageIO', worker);

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
              config: _itkConfig.default
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
var workerPool = new _WorkerPool.default(numberOfWorkers, workerFunction);
var seriesBlockSize = 8;

var readImageDICOMFileSeries = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee2(fileList) {
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

    return _regeneratorRuntime.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            singleSortedSeries = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : false;
            fetchFileDescriptions = Array.from(fileList, function (file) {
              return _promiseFileReader.default.readAsArrayBuffer(file).then(function (arrayBuffer) {
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
            stacked = (0, _stackImages.default)(images);
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

var _default = readImageDICOMFileSeries;
exports.default = _default;