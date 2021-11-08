"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _bufferToTypedArray = _interopRequireDefault(require("./bufferToTypedArray"));

function readImageHTTP(_x) {
  return _readImageHTTP.apply(this, arguments);
}

function _readImageHTTP() {
  _readImageHTTP = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(url) {
    var imageResponse, image, pixelBufferResponse;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _axios.default.get(url, {
              responseType: 'json'
            });

          case 2:
            imageResponse = _context.sent;
            image = imageResponse.data;
            _context.next = 6;
            return _axios.default.get(url + '.data', {
              responseType: 'arraybuffer'
            });

          case 6:
            pixelBufferResponse = _context.sent;
            image.data = (0, _bufferToTypedArray.default)(image.imageType.componentType, pixelBufferResponse.data);
            return _context.abrupt("return", image);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _readImageHTTP.apply(this, arguments);
}

var _default = readImageHTTP;
exports.default = _default;