"use strict";

const MeshType = require('./MeshType.js');

const Mesh = function (meshType = new MeshType()) {
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