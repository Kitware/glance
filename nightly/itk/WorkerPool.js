import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

var WorkerPool =
/*#__PURE__*/
function () {
  /* poolSize is the maximum number of web workers to create in the pool.
   *
   * The function, fcn, should accept null or an existing worker as its first argument.
   * It most also return and object with the used worker on the `webWorker`
   * property.  * Example: runPipelineBrowser.
   *
   **/
  function WorkerPool(poolSize, fcn) {
    _classCallCheck(this, WorkerPool);

    this.fcn = fcn;
    this.workerQueue = new Array(poolSize);
    this.workerQueue.fill(null);
    this.runInfo = [];
  }
  /*
   * Run the tasks specified by the arguments in the taskArgsArray that will
   * be passed to the pool fcn.
   *
   * An optional progressCallback will be cassed with the number of complete
   * tasks and the total number of tasks as arguments every time a task has
   * completed.
   */


  _createClass(WorkerPool, [{
    key: "runTasks",
    value: function runTasks(taskArgsArray, progressCallback) {
      var _this = this;

      var info = {
        taskQueue: [],
        results: [],
        addingTasks: false,
        postponed: false,
        runningWorkers: 0,
        progressCallback: progressCallback
      };
      this.runInfo.push(info);
      info.index = this.runInfo.length - 1;
      return new Promise(function (resolve, reject) {
        info.resolve = resolve;
        info.reject = reject;
        info.results = new Array(taskArgsArray.length);
        info.completedTasks = 0;
        info.addingTasks = true;
        taskArgsArray.forEach(function (taskArg, index) {
          _this.addTask(info.index, index, taskArg);
        });
        info.addingTasks = false;
      });
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
    } // todo: change to #addTask(resultIndex, taskArgs) { after private methods
    // proposal accepted and supported by default in Babel.

  }, {
    key: "addTask",
    value: function addTask(infoIndex, resultIndex, taskArgs) {
      var _this2 = this;

      var info = this.runInfo[infoIndex];

      if (this.workerQueue.length > 0) {
        var worker = this.workerQueue.pop();
        info.runningWorkers++;
        this.fcn.apply(this, [worker].concat(_toConsumableArray(taskArgs))).then(function (_ref) {
          var webWorker = _ref.webWorker,
              result = _objectWithoutProperties(_ref, ["webWorker"]);

          _this2.workerQueue.push(webWorker);

          info.runningWorkers--;
          info.results[resultIndex] = result;
          info.completedTasks++;

          if (info.progressCallback) {
            info.progressCallback(info.completedTasks, info.results.length);
          }

          if (info.taskQueue.length > 0) {
            var reTask = info.taskQueue.shift();

            _this2.addTask.apply(_this2, [infoIndex].concat(_toConsumableArray(reTask)));
          } else if (!info.addingTasks && !info.runningWorkers) {
            var results = info.results;
            var clearIndex = info.index;
            _this2.runInfo[clearIndex] = null;
            info.resolve(results);
          }
        })["catch"](function (error) {
          var reject = info.reject;
          var clearIndex = info.index;
          _this2.runInfo[clearIndex] = null;
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
    }
  }]);

  return WorkerPool;
}();

export default WorkerPool;