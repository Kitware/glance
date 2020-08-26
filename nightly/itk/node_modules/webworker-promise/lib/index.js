'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TinyEmitter = require('./tiny-emitter');

var MESSAGE_RESULT = 0;
var MESSAGE_EVENT = 1;

var RESULT_ERROR = 0;
var RESULT_SUCCESS = 1;

var Worker = function (_TinyEmitter) {
  _inherits(Worker, _TinyEmitter);

  /**
   *
   * @param worker {Worker}
   */
  function Worker(worker) {
    _classCallCheck(this, Worker);

    var _this = _possibleConstructorReturn(this, (Worker.__proto__ || Object.getPrototypeOf(Worker)).call(this));

    _this._messageId = 1;
    _this._messages = new Map();

    _this._worker = worker;
    _this._worker.onmessage = _this._onMessage.bind(_this);
    _this._id = Math.ceil(Math.random() * 10000000);
    return _this;
  }

  _createClass(Worker, [{
    key: 'terminate',
    value: function terminate() {
      this._worker.terminate();
    }

    /**
     * return true if there is no unresolved jobs
     * @returns {boolean}
     */

  }, {
    key: 'isFree',
    value: function isFree() {
      return this._messages.size === 0;
    }
  }, {
    key: 'jobsLength',
    value: function jobsLength() {
      return this._messages.size;
    }

    /**
     * @param operationName string
     * @param data any
     * @param transferable array
     * @param onEvent function
     * @returns {Promise}
     */

  }, {
    key: 'exec',
    value: function exec(operationName) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var _this2 = this;

      var transferable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var onEvent = arguments[3];

      return new Promise(function (res, rej) {
        var messageId = _this2._messageId++;
        _this2._messages.set(messageId, [res, rej, onEvent]);
        _this2._worker.postMessage([messageId, data, operationName], transferable || []);
      });
    }

    /**
     *
     * @param data any
     * @param transferable array
     * @param onEvent function
     * @returns {Promise}
     */

  }, {
    key: 'postMessage',
    value: function postMessage() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var _this3 = this;

      var transferable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var onEvent = arguments[2];

      return new Promise(function (res, rej) {
        var messageId = _this3._messageId++;
        _this3._messages.set(messageId, [res, rej, onEvent]);
        _this3._worker.postMessage([messageId, data], transferable || []);
      });
    }
  }, {
    key: 'emit',
    value: function emit(eventName) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this._worker.postMessage({ eventName: eventName, args: args });
    }
  }, {
    key: '_onMessage',
    value: function _onMessage(e) {
      //if we got usual event, just emit it locally
      if (!Array.isArray(e.data) && e.data.eventName) {
        var _get2;

        return (_get2 = _get(Worker.prototype.__proto__ || Object.getPrototypeOf(Worker.prototype), 'emit', this)).call.apply(_get2, [this, e.data.eventName].concat(_toConsumableArray(e.data.args)));
      }

      var _e$data = _toArray(e.data),
          type = _e$data[0],
          args = _e$data.slice(1);

      if (type === MESSAGE_EVENT) this._onEvent.apply(this, _toConsumableArray(args));else if (type === MESSAGE_RESULT) this._onResult.apply(this, _toConsumableArray(args));else throw new Error('Wrong message type \'' + type + '\'');
    }
  }, {
    key: '_onResult',
    value: function _onResult(messageId, success, payload) {
      var _messages$get = this._messages.get(messageId),
          _messages$get2 = _slicedToArray(_messages$get, 2),
          res = _messages$get2[0],
          rej = _messages$get2[1];

      this._messages.delete(messageId);

      return success === RESULT_SUCCESS ? res(payload) : rej(payload);
    }
  }, {
    key: '_onEvent',
    value: function _onEvent(messageId, eventName, data) {
      var _messages$get3 = this._messages.get(messageId),
          _messages$get4 = _slicedToArray(_messages$get3, 3),
          onEvent = _messages$get4[2];

      if (onEvent) {
        onEvent(eventName, data);
      }
    }
  }]);

  return Worker;
}(TinyEmitter);

module.exports = Worker;