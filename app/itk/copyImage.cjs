"use strict";

const Image = require('./Image.js');

const Matrix = require('./Matrix.js');

const copyImage = image => {
  const copy = new Image(image.imageType);
  copy.name = image.name;
  const dimension = image.imageType.dimension;
  copy.origin = Array.from(image.origin);
  copy.spacing = Array.from(image.spacing);
  copy.direction = new Matrix(dimension, dimension);
  copy.direction.data = Array.from(image.direction.data);
  copy.size = Array.from(image.size);
  copy.data = new image.data.constructor(image.data.length);
  copy.data.set(image.data, 0);
  return copy;
};

module.exports = copyImage;