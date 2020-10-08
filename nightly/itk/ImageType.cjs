"use strict";

const IntTypes = require('./IntTypes.js');

const PixelTypes = require('./PixelTypes.js');

const ImageType = function (dimension = 2, componentType = IntTypes.UInt8, pixelType = PixelTypes.Scalar, components = 1) {
  this.dimension = dimension;
  this.componentType = componentType;
  this.pixelType = pixelType;
  this.components = components;
};

module.exports = ImageType;