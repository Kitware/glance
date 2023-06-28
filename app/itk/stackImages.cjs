"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const Image = require('./Image.js');

const Matrix = require('./Matrix.js');
/** Join an array of sequential image slabs into a single image */


function stackImages(images) {
  const result = new Image(images[0].imageType);
  result.origin = Array.from(images[0].origin);
  result.spacing = Array.from(images[0].spacing);
  const dimension = result.imageType.dimension;
  result.direction = new Matrix(dimension, dimension);
  result.direction.data = Array.from(images[0].direction.data);
  const stackOn = dimension - 1;
  result.size = Array.from(images[0].size);
  const stackedSize = images.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.size[stackOn];
  }, 0);
  result.size[stackOn] = stackedSize;
  const dataSize = result.size.reduce((accumulator, currentValue) => {
    return accumulator * currentValue;
  }, 1) * result.imageType.components;
  result.data = new images[0].data.constructor(dataSize);
  let offsetBase = result.imageType.components;

  for (let subIndex = 0; subIndex < result.size.length - 1; subIndex++) {
    offsetBase *= result.size[subIndex];
  }

  let stackIndex = 0;

  for (let index = 0; index < images.length; index++) {
    result.data.set(images[index].data, offsetBase * stackIndex);
    stackIndex += images[index].size[stackOn];
  }

  return result;
}

var _default = stackImages;
exports.default = _default;