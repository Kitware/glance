"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var copyImage = require('./copyImage.js');

var haveSharedArrayBuffer = typeof window.SharedArrayBuffer === 'function';
/** If SharedArrayBuffer's are available, ensure an itk.Image's buffer is a
 * SharedArrayBuffer. If SharedArrayBuffer's are not available, return a copy.
 * */

var imageSharedBufferOrCopy = function imageSharedBufferOrCopy(image) {
  if (haveSharedArrayBuffer) {
    if (image.data.buffer instanceof SharedArrayBuffer) {
      // eslint-disable-line
      return image;
    }

    var sharedBuffer = new SharedArrayBuffer(image.data.buffer.byteLength); // eslint-disable-line

    var sharedTypedArray = new image.data.constructor(sharedBuffer);
    sharedTypedArray.set(image.data, 0);
    image.data = sharedTypedArray;
    return image;
  } else {
    return copyImage(image);
  }
};

var _default = imageSharedBufferOrCopy;
exports.default = _default;