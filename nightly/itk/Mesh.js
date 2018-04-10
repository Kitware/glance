var MeshType = require('./MeshType.js');

var Mesh = function Mesh() {
  var meshType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new MeshType();

  this.meshType = meshType;

  this.name = 'Mesh';

  this.numberOfPoints = 0;
  this.points = new ArrayBuffer(0);

  this.numberOfPointPixels = 0;
  this.pointData = new ArrayBuffer(0);

  this.numberOfCells = 0;
  this.cells = new ArrayBuffer(0);

  this.numberOfCellPixels = 0;
  this.cellData = new ArrayBuffer(0);
  this.cellBufferSize = 0;
};

module.exports = Mesh;