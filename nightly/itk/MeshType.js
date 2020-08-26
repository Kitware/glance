var IntTypes = require('./IntTypes.js');

var FloatTypes = require('./FloatTypes.js');

var PixelTypes = require('./PixelTypes.js');

var MeshType = function MeshType() {
  var dimension = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
  var pointComponentType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FloatTypes.Float32;
  var pointPixelComponentType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : FloatTypes.Float32;
  var pointPixelType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : PixelTypes.Scalar;
  var pointPixelComponents = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var cellComponentType = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : IntTypes.Int32;
  var cellPixelComponentType = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : FloatTypes.Float32;
  var cellPixelType = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : PixelTypes.Scalar;
  var cellPixelComponents = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 1;
  this.dimension = dimension;
  this.pointComponentType = pointComponentType;
  this.pointPixelComponentType = pointPixelComponentType;
  this.pointPixelType = pointPixelType;
  this.pointPixelComponents = pointPixelComponents;
  this.cellComponentType = cellComponentType;
  this.cellPixelComponentType = cellPixelComponentType;
  this.cellPixelType = cellPixelType;
  this.cellPixelComponents = cellPixelComponents;
};

module.exports = MeshType;