var ImageType = require('./ImageType.js');

var Matrix = require('./Matrix.js');

var Image = function Image() {
  var imageType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new ImageType();
  this.imageType = imageType;
  this.name = 'Image';
  var dimension = imageType.dimension;
  this.origin = new Array(dimension);
  this.origin.fill(0.0);
  this.spacing = new Array(dimension);
  this.spacing.fill(1.0);
  this.direction = new Matrix(dimension, dimension);
  this.direction.setIdentity();
  this.size = new Array(dimension);
  this.size.fill(0);
  this.data = null;
};

module.exports = Image;