import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import axios from 'axios';
import bufferToTypedArray from './bufferToTypedArray';

function readImageHTTP(_x) {
  return _readImageHTTP.apply(this, arguments);
}

function _readImageHTTP() {
  _readImageHTTP = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(url) {
    var imageResponse, image, pixelBufferResponse;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
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
    }, _callee);
  }));
  return _readImageHTTP.apply(this, arguments);
}

export default readImageHTTP;