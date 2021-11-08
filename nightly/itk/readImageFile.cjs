"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _createWebworkerPromise = _interopRequireDefault(require("./createWebworkerPromise"));

var _promiseFileReader = _interopRequireDefault(require("promise-file-reader"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

var readImageFile = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(webWorker, file) {
    var worker, _yield$createWebworke, webworkerPromise, usedWorker, arrayBuffer, image;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            worker = webWorker;
            _context.next = 3;
            return (0, _createWebworkerPromise.default)('ImageIO', worker);

          case 3:
            _yield$createWebworke = _context.sent;
            webworkerPromise = _yield$createWebworke.webworkerPromise;
            usedWorker = _yield$createWebworke.worker;
            worker = usedWorker;
            _context.next = 9;
            return _promiseFileReader.default.readAsArrayBuffer(file);

          case 9:
            arrayBuffer = _context.sent;
            _context.prev = 10;
            _context.next = 13;
            return webworkerPromise.postMessage({
              operation: 'readImage',
              name: file.name,
              type: file.type,
              data: arrayBuffer,
              config: _itkConfig.default
            }, [arrayBuffer]);

          case 13:
            image = _context.sent;
            return _context.abrupt("return", {
              image: image,
              webWorker: worker
            });

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](10);
            throw Error(_context.t0);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[10, 17]]);
  }));

  return function readImageFile(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _default = readImageFile;
exports.default = _default;