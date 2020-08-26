var Image = require('./Image.js');

var Matrix = require('./Matrix.js');

var copyImage = function copyImage(image) {
  var copy = new Image(image.imageType);
  copy.name = image.name;
  var dimension = image.imageType.dimension;
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