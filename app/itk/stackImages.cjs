"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Image = require('./Image.js');

var Matrix = require('./Matrix.js');
/** Join an array of sequential image slabs into a single image */


function stackImages(images) {
  var result = new Image(images[0].imageType);
  result.origin = Array.from(images[0].origin);
  result.spacing = Array.from(images[0].spacing);
  var dimension = result.imageType.dimension;
  result.direction = new Matrix(dimension, dimension);
  result.direction.data = Array.from(images[0].direction.data);
  var stackOn = dimension - 1;
  result.size = Array.from(images[0].size);
  var stackedSize = images.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue.size[stackOn];
  }, 0);
  result.size[stackOn] = stackedSize;
  var dataSize = result.size.reduce(function (accumulator, currentValue) {
    return accumulator * currentValue;
  }, 1) * result.imageType.components;
  result.data = new images[0].data.constructor(dataSize);
  var offsetBase = result.imageType.components;

  for (var subIndex = 0; subIndex < result.size.length - 1; subIndex++) {
    offsetBase *= result.size[subIndex];
  }

  var stackIndex = 0;

  for (var index = 0; index < images.length; index++) {
    result.data.set(images[index].data, offsetBase * stackIndex);
    stackIndex += images[index].size[stackOn];
  }

  return result;
}

var _default = stackImages;
exports.default = _default;