function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import axios from 'axios';
import bufferToTypedArray from './bufferToTypedArray';

function readImageHTTP(_x) {
  return _readImageHTTP.apply(this, arguments);
}

function _readImageHTTP() {
  _readImageHTTP = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(url) {
    var imageResponse, image, pixelBufferResponse;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return axios.get(url, {
              responseType: 'json'
            });

          case 2:
            imageResponse = _context.sent;
            image = imageResponse.data;
            _context.next = 6;
            return axios.get(url + '.data', {
              responseType: 'arraybuffer'
            });

          case 6:
            pixelBufferResponse = _context.sent;
            image.data = bufferToTypedArray(image.imageType.componentType, pixelBufferResponse.data);
            return _context.abrupt("return", image);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _readImageHTTP.apply(this, arguments);
}

export default readImageHTTP;