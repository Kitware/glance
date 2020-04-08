function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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