import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import stackImages from './stackImages';
import readImageArrayBuffer from './readImageArrayBuffer';
import Matrix from './Matrix';
import WorkerPool from './WorkerPool';
import PromiseFileReader from 'promise-file-reader';
var numberOfWorkers = navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 6;
var workerPool = new WorkerPool(numberOfWorkers, readImageArrayBuffer);

var readImageFileSeries = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(fileList) {
    var zSpacing,
        zOrigin,
        sortedSeries,
        fetchFileDescriptions,
        fileDescriptions,
        taskArgsArray,
        index,
        results,
        images,
        stacked,
        _args = arguments;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            zSpacing = _args.length > 1 && _args[1] !== undefined ? _args[1] : 1.0;
            zOrigin = _args.length > 2 && _args[2] !== undefined ? _args[2] : 0.0;
            sortedSeries = _args.length > 3 && _args[3] !== undefined ? _args[3] : false;
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
            _context.next = 6;
            return Promise.all(fetchFileDescriptions);

          case 6:
            fileDescriptions = _context.sent;

            if (!sortedSeries) {
              fileDescriptions.sort(function (a, b) {
                if (a.name < b.name) {
                  return -1;
                }

                if (a.name > b.name) {
                  return 1;
                }

                return 0;
              });
            }

            taskArgsArray = [];

            for (index = 0; index < fileDescriptions.length; index++) {
              taskArgsArray.push([fileDescriptions[index].data, fileDescriptions[index].name]);
            }

            _context.next = 12;
            return workerPool.runTasks(taskArgsArray).promise;

          case 12:
            results = _context.sent;
            images = results.map(function (result) {
              var image = result.image;
              image.imageType.dimension = 3;
              image.size.push(1);
              image.spacing.push(zSpacing);
              image.origin.push(zOrigin);
              image.direction = new Matrix(3, 3);
              image.direction.setIdentity();
              return image;
            });
            stacked = stackImages(images);
            return _context.abrupt("return", {
              image: stacked,
              webWorkerPool: workerPool
            });

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function readImageFileSeries(_x) {
    return _ref.apply(this, arguments);
  };
}();

export default readImageFileSeries;