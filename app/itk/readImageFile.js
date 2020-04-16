import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import createWebworkerPromise from './createWebworkerPromise';
import PromiseFileReader from 'promise-file-reader';
import config from './itkConfig';

var readImageFile =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(webWorker, file) {
    var worker, _ref2, webworkerPromise, usedWorker, arrayBuffer, image;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            worker = webWorker;
            _context.next = 3;
            return createWebworkerPromise('ImageIO', worker);

          case 3:
            _ref2 = _context.sent;
            webworkerPromise = _ref2.webworkerPromise;
            usedWorker = _ref2.worker;
            worker = usedWorker;
            _context.next = 9;
            return PromiseFileReader.readAsArrayBuffer(file);

          case 9:
            arrayBuffer = _context.sent;
            _context.prev = 10;
            _context.next = 13;
            return webworkerPromise.postMessage({
              operation: 'readImage',
              name: file.name,
              type: file.type,
              data: arrayBuffer,
              config: config
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

export default readImageFile;