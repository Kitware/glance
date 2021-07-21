"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _bufferToTypedArray = _interopRequireDefault(require("./bufferToTypedArray"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function readImageHTTP(url) {
  const imageResponse = await _axios.default.get(url, {
    responseType: 'json'
  });
  const image = imageResponse.data;
  const pixelBufferResponse = await _axios.default.get(url + '.data', {
    responseType: 'arraybuffer'
  });
  image.data = (0, _bufferToTypedArray.default)(image.imageType.componentType, pixelBufferResponse.data);
  return image;
}

var _default = readImageHTTP;
exports.default = _default;