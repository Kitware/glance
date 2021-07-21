'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChildProcess = require('child_process');
var path = require('path');

var Worker = function () {
  function Worker(script) {
    var _this = this;

    _classCallCheck(this, Worker);

    this._process = ChildProcess.fork(path.join(__dirname, 'node-child-process.js'), [script]);
    this._process.on('message', function (data) {
      return _this.onmessage({ data: data });
    });
  }

  _createClass(Worker, [{
    key: 'postMessage',
    value: function postMessage(data) {
      this._process.send(data);
    }
  }, {
    key: 'onmessage',
    value: function onmessage(data) {}
  }, {
    key: 'terminate',
    value: function terminate() {
      // terminated
      this._process.kill('SIGINT');
      this._terminated = true;
    }
  }]);

  return Worker;
}();

module.exports = Worker;