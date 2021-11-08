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

var readDICOMTags = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(webWorker, file) {
    var tags,
        worker,
        _yield$createWebworke,
        webworkerPromise,
        usedWorker,
        arrayBuffer,
        tagValues,
        _args = arguments;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tags = _args.length > 2 && _args[2] !== undefined ? _args[2] : null;
            worker = webWorker;
            _context.next = 4;
            return (0, _createWebworkerPromise.default)('ImageIO', worker);

          case 4:
            _yield$createWebworke = _context.sent;
            webworkerPromise = _yield$createWebworke.webworkerPromise;
            usedWorker = _yield$createWebworke.worker;
            worker = usedWorker;
            _context.next = 10;
            return _promiseFileReader.default.readAsArrayBuffer(file);

          case 10:
            arrayBuffer = _context.sent;
            _context.prev = 11;
            _context.next = 14;
            return webworkerPromise.postMessage({
              operation: 'readDICOMTags',
              name: file.name,
              type: file.type,
              data: arrayBuffer,
              tags: tags,
              config: _itkConfig.default
            }, [arrayBuffer]);

          case 14:
            tagValues = _context.sent;
            return _context.abrupt("return", {
              tags: tagValues,
              webWorker: worker
            });

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](11);
            throw Error(_context.t0);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[11, 18]]);
  }));

  return function readDICOMTags(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _default = readDICOMTags;
exports.default = _default;