"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var haveSharedArrayBuffer = typeof self.SharedArrayBuffer === 'function'; // eslint-disable-line

function getTransferable(data) {
  var result = null;

  if (data.buffer) {
    result = data.buffer;
  } else if (data.byteLength) {
    result = data;
  }

  if (!!result && haveSharedArrayBuffer && result instanceof SharedArrayBuffer) {
    // eslint-disable-line
    result = null;
  }

  return result;
}

var _default = getTransferable;
exports.default = _default;