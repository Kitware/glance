var MeshType = require('./MeshType.js');

var Mesh = function Mesh() {
  var meshType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new MeshType();
  this.meshType = meshType;
  this.name = 'Mesh';
  this.numberOfPoints = 0;
  this.points = null;
  this.numberOfPointPixels = 0;
  this.pointData = null;
  this.numberOfCells = 0;
  this.cells = null;
  this.numberOfCellPixels = 0;
  this.cellData = null;
  this.cellBufferSize = 0;
};

module.exports = Mesh;