'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebWorkerPromise = require('./index');

var WorkerPool = function () {
  function WorkerPool(_ref) {
    var create = _ref.create,
        maxThreads = _ref.maxThreads,
        terminateAfterDelay = _ref.terminateAfterDelay,
        maxConcurrentPerWorker = _ref.maxConcurrentPerWorker;

    _classCallCheck(this, WorkerPool);

    this._queue = [];
    this._workers = [];
    this._createWorker = create;
    this._maxThreads = maxThreads;
    this._terminateAfterDelay = terminateAfterDelay;
    this._maxConcurrentPerWorker = maxConcurrentPerWorker;

    var worker = this._createWebWorker();
    this._workers.push(worker);
  }

  /**
   const pool = WorkerPool.create({
    src: 'my-worker.js',
    // or create: () => new Worker()
    maxThreads: 2
   });
   */

  _createClass(WorkerPool, [{
    key: 'exec',
    value: function exec() {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var worker = this.getFreeWorkerOrCreate();
      if (worker) return this._exec(worker, 'exec', args);

      return new Promise(function (res) {
        return _this._queue.push(['exec', args, res]);
      });
    }
  }, {
    key: 'postMessage',
    value: function postMessage() {
      var _this2 = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var worker = this.getFreeWorkerOrCreate();
      if (worker) {
        return this._exec(worker, 'postMessage', args);
      }

      return new Promise(function (res) {
        return _this2._queue.push(['postMessage', args, res]);
      });
    }
  }, {
    key: '_exec',
    value: function _exec(worker, method, args) {
      var _this3 = this;

      return new Promise(function (res, rej) {
        worker[method].apply(worker, _toConsumableArray(args)).then(function (result) {
          _this3._onWorkDone(worker);
          res(result);
        }).catch(function (e) {
          _this3._onWorkDone(worker);
          rej(e);
        });
      });
    }

    // if there is unresolved jobs, run them
    // or remove unused workers

  }, {
    key: '_onWorkDone',
    value: function _onWorkDone() {
      if (this._queue.length) {
        var worker = void 0;
        while (this._queue.length && (worker = this.getFreeWorkerOrCreate())) {
          var _queue$shift = this._queue.shift(),
              _queue$shift2 = _slicedToArray(_queue$shift, 3),
              method = _queue$shift2[0],
              args = _queue$shift2[1],
              cb = _queue$shift2[2];

          cb(this._exec(worker, method, args));
        }
      }

      var freeWorkers = this.getAllFreeWorkers();
      if (freeWorkers.length) {
        this._waitAndRemoveWorkers(freeWorkers);
      }
    }

    // remove workers if its not using after delay

  }, {
    key: '_waitAndRemoveWorkers',
    value: function _waitAndRemoveWorkers(workers) {
      var _this4 = this;

      setTimeout(function () {
        // only one worker should be alive always
        workers = workers.filter(function (w) {
          return w.isFree();
        }).slice(0, _this4._workers.length - 1);
        workers.forEach(function (worker) {
          return _this4._removeWorker(worker);
        });
      }, this._terminateAfterDelay);
    }
  }, {
    key: '_removeWorker',
    value: function _removeWorker(worker) {
      this._workers = this._workers.filter(function (w) {
        return w._id !== worker._id;
      });
      worker.terminate();
    }
  }, {
    key: 'getAllFreeWorkers',
    value: function getAllFreeWorkers() {
      var _this5 = this;

      return this._workers.filter(function (w) {
        return w.jobsLength() < _this5._maxConcurrentPerWorker;
      });
    }
  }, {
    key: 'getFreeWorkerOrCreate',
    value: function getFreeWorkerOrCreate() {
      var _this6 = this;

      var freeWorker = this._workers.find(function (w) {
        return w.jobsLength() < _this6._maxConcurrentPerWorker;
      });

      if (!freeWorker && this._workers.length < this._maxThreads) {
        var worker = this._createWebWorker();
        this._workers.push(worker);
        return worker;
      }

      return freeWorker;
    }
  }, {
    key: '_createWebWorker',
    value: function _createWebWorker() {
      return new WebWorkerPromise(this._createWorker());
    }
  }], [{
    key: 'create',
    value: function create(opts) {
      if (!opts.create) opts.create = function () {
        return new Worker(opts.src);
      };

      if (!opts.terminateAfterDelay) opts.terminateAfterDelay = 5000;
      if (!opts.maxThreads) opts.maxThreads = 2;
      if (!opts.maxConcurrentPerWorker) {
        opts.maxConcurrentPerWorker = 1;
      }

      return new WorkerPool(opts);
    }
  }]);

  return WorkerPool;
}();

module.exports = WorkerPool;