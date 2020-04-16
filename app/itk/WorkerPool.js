import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

var WorkerPool =
/*#__PURE__*/
function () {
  /* The function, fcn, should accept null or an existing worker as its first argument.
   * It most also return and object with the used worker on the `webWorker`
   * property. Example: runPipelineBrowser. */
  function WorkerPool(poolSize, fcn) {
    _classCallCheck(this, WorkerPool);

    this.fcn = fcn;
    this.workerQueue = new Array(poolSize);
    this.workerQueue.fill(null);
    this.taskQueue = [];
    this.results = [];
    this.addingTasks = false;
    this.runningWorkers = 0;
  } // todo: change to #addTask(resultIndex, taskArgs) { after private methods
  // proposal accepted and supported by default in Babel.


  _createClass(WorkerPool, [{
    key: "addTask",
    value: function addTask(resultIndex, taskArgs) {
      var _this = this;

      if (this.workerQueue.length > 0) {
        var worker = this.workerQueue.pop();
        this.runningWorkers++;
        this.fcn.apply(this, [worker].concat(_toConsumableArray(taskArgs))).then(function (_ref) {
          var webWorker = _ref.webWorker,
              result = _objectWithoutProperties(_ref, ["webWorker"]);

          _this.workerQueue.push(webWorker);

          _this.runningWorkers--;
          _this.results[resultIndex] = result;

          if (_this.taskQueue.length > 0) {
            var reTask = _this.taskQueue.shift();

            _this.addTask.apply(_this, _toConsumableArray(reTask));
          } else if (!_this.addingTasks && !_this.runningWorkers) {
            _this.resolve(_this.results);
          }
        })["catch"](function (error) {
          _this.reject(error);
        });
      } else {
        this.taskQueue.push([resultIndex, taskArgs]);
      }
    }
  }, {
    key: "runTasks",
    value: function runTasks(taskArgsArray) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.resolve = resolve;
        _this2.reject = reject;
        _this2.results = new Array(taskArgsArray.length);
        _this2.addingTasks = true;
        taskArgsArray.forEach(function (taskArg, index) {
          _this2.addTask(index, taskArg);
        });
        _this2.addingTasks = false;
      });
    }
  }]);

  return WorkerPool;
}();

export default WorkerPool;