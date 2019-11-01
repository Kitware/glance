var IntTypes = require('./IntTypes.js');

var PixelTypes = require('./PixelTypes.js');

var ImageType = function ImageType() {
  var dimension = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
  var componentType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : IntTypes.UInt8;
  var pixelType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PixelTypes.Scalar;
  var components = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  this.dimension = dimension;
  this.componentType = componentType;
  this.pixelType = pixelType;
  this.components = components;
};

module.exports = ImageType;