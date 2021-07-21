'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

global.self = new (function () {
  function Worker() {
    _classCallCheck(this, Worker);
  }

  _createClass(Worker, [{
    key: 'postMessage',
    value: function postMessage(m) {
      process.send(m);
    }
  }, {
    key: 'addEventListener',
    value: function addEventListener(eventName, listener) {
      if (eventName === 'message') {
        process.on('message', function (data) {
          return listener({ data: data });
        });
      }
    }
  }]);

  return Worker;
}())();

require(process.argv[2]);