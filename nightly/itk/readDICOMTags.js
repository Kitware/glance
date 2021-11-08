import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import createWebworkerPromise from './createWebworkerPromise';
import PromiseFileReader from 'promise-file-reader';
import config from './itkConfig';

var readDICOMTags = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(webWorker, file) {
    var tags,
        worker,
        _yield$createWebworke,
        webworkerPromise,
        usedWorker,
        arrayBuffer,
        tagValues,
        _args = arguments;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tags = _args.length > 2 && _args[2] !== undefined ? _args[2] : null;
            worker = webWorker;
            _context.next = 4;
            return createWebworkerPromise('ImageIO', worker);

          case 4:
            _yield$createWebworke = _context.sent;
            webworkerPromise = _yield$createWebworke.webworkerPromise;
            usedWorker = _yield$createWebworke.worker;
            worker = usedWorker;
            _context.next = 10;
            return PromiseFileReader.readAsArrayBuffer(file);

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
              config: config
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

export default readDICOMTags;