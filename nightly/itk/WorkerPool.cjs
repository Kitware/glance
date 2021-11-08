"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var WorkerPool = /*#__PURE__*/function () {
  /* poolSize is the maximum number of web workers to create in the pool.
   *
   * The function, fcn, should accept null or an existing worker as its first argument.
   * It most also return and object with the used worker on the `webWorker`
   * property.  * Example: runPipelineBrowser.
   *
   **/
  function WorkerPool(poolSize, fcn) {
    (0, _classCallCheck2.default)(this, WorkerPool);
    this.fcn = fcn;
    this.workerQueue = new Array(poolSize);
    this.workerQueue.fill(null);
    this.runInfo = [];
  }
  /*
   * Run the tasks specified by the arguments in the taskArgsArray that will
   * be passed to the pool fcn.
   *
   * An optional progressCallback will be called with the number of complete
   * tasks and the total number of tasks as arguments every time a task has
   * completed.
   *
   * Returns an object containing a promise ('promise') to communicate results
   * as well as an id ('runId') which can be used to cancel any remaining pending
   * tasks before they complete.
   */


  (0, _createClass2.default)(WorkerPool, [{
    key: "runTasks",
    value: function runTasks(taskArgsArray, progressCallback) {
      var _this = this;

      var info = {
        taskQueue: [],
        results: [],
        addingTasks: false,
        postponed: false,
        runningWorkers: 0,
        progressCallback: progressCallback,
        canceled: false
      };
      this.runInfo.push(info);
      info.index = this.runInfo.length - 1;
      return {
        promise: new Promise(function (resolve, reject) {
          info.resolve = resolve;
          info.reject = reject;
          info.results = new Array(taskArgsArray.length);
          info.completedTasks = 0;
          info.addingTasks = true;
          taskArgsArray.forEach(function (taskArg, index) {
            _this.addTask(info.index, index, taskArg);
          });
          info.addingTasks = false;
        }),
        runId: info.index
      };
    }
  }, {
    key: "terminateWorkers",
    value: function terminateWorkers() {
      for (var index = 0; index < this.workerQueue.length; index++) {
        var worker = this.workerQueue[index];

        if (worker) {
          worker.terminate();
        }

        this.workerQueue[index] = null;
      }
    }
  }, {
    key: "cancel",
    value: function cancel(runId) {
      var info = this.runInfo[runId];

      if (info) {
        info.canceled = true;
      }
    } // todo: change to #addTask(resultIndex, taskArgs) { after private methods
    // proposal accepted and supported by default in Babel.

  }, {
    key: "addTask",
    value: function addTask(infoIndex, resultIndex, taskArgs) {
      var _this2 = this;

      var info = this.runInfo[infoIndex];

      if (info && info.canceled) {
        this.clearTask(info.index);
        info.reject('Remaining tasks canceled');
        return;
      }

      if (this.workerQueue.length > 0) {
        var worker = this.workerQueue.pop();
        info.runningWorkers++;
        this.fcn.apply(this, [worker].concat((0, _toConsumableArray2.default)(taskArgs))).then(function (_ref) {
          var webWorker = _ref.webWorker,
              result = (0, _objectWithoutProperties2.default)(_ref, ["webWorker"]);

          _this2.workerQueue.push(webWorker); // Check if this task was canceled while it was getting done


          if (_this2.runInfo[infoIndex] !== null) {
            info.runningWorkers--;
            info.results[resultIndex] = result;
            info.completedTasks++;

            if (info.progressCallback) {
              info.progressCallback(info.completedTasks, info.results.length);
            }

            if (info.taskQueue.length > 0) {
              var reTask = info.taskQueue.shift();

              _this2.addTask.apply(_this2, [infoIndex].concat((0, _toConsumableArray2.default)(reTask)));
            } else if (!info.addingTasks && !info.runningWorkers) {
              var results = info.results;

              _this2.clearTask(info.index);

              info.resolve(results);
            }
          }
        }).catch(function (error) {
          var reject = info.reject;

          _this2.clearTask(info.index);

          reject(error);
        });
      } else {
        if (info.runningWorkers || info.postponed === true) {
          // At least one worker is working on these tasks, and it will pick up
          // the next item in the taskQueue when done.
          info.taskQueue.push([resultIndex, taskArgs]);
        } else {
          // Try again later.
          info.postponed = true;
          setTimeout(function () {
            info.postponed = false;

            _this2.addTask(info.index, resultIndex, taskArgs);
          }, 50);
        }
      }
    } // todo: change to #clearTask(clearIndex) { after private methods
    // proposal accepted and supported by default in Babel.

  }, {
    key: "clearTask",
    value: function clearTask(clearIndex) {
      this.runInfo[clearIndex].results = null;
      this.runInfo[clearIndex].taskQueue = null;
      this.runInfo[clearIndex].progressCallback = null;
      this.runInfo[clearIndex].canceled = null;
      this.runInfo[clearIndex] = null;
    }
  }]);
  return WorkerPool;
}();

var _default = WorkerPool;
exports.default = _default;