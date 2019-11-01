var PixelTypes = require('./PixelTypes.js');

var meshIOPixelTypeToJSPixelType = function meshIOPixelTypeToJSPixelType(module, ioPixelType) {
  var pixelType = null;

  switch (ioPixelType) {
    case module.IOPixelType.UNKNOWNPIXELTYPE:
      {
        pixelType = PixelTypes.Unknown;
        break;
      }

    case module.IOPixelType.SCALAR:
      {
        pixelType = PixelTypes.Scalar;
        break;
      }

    case module.IOPixelType.RGB:
      {
        pixelType = PixelTypes.RGB;
        break;
      }

    case module.IOPixelType.RGBA:
      {
        pixelType = PixelTypes.RGBA;
        break;
      }

    case module.IOPixelType.OFFSET:
      {
        pixelType = PixelTypes.Offset;
        break;
      }

    case module.IOPixelType.VECTOR:
      {
        pixelType = PixelTypes.Vector;
        break;
      }

    case module.IOPixelType.POINT:
      {
        pixelType = PixelTypes.Point;
        break;
      }

    case module.IOPixelType.COVARIANTVECTOR:
      {
        pixelType = PixelTypes.CovariantVector;
        break;
      }

    case module.IOPixelType.SYMMETRICSECONDRANKTENSOR:
      {
        pixelType = PixelTypes.SymmetricSecondRankTensor;
        break;
      }

    case module.IOPixelType.DIFFUSIONTENSOR3D:
      {
        pixelType = PixelTypes.DiffusionTensor3D;
        break;
      }

    case module.IOPixelType.COMPLEX:
      {
        pixelType = PixelTypes.Complex;
        break;
      }

    case module.IOPixelType.FIXEDARRAY:
      {
        pixelType = PixelTypes.FixedArray;
        break;
      }

    case module.IOPixelType.ARRAY:
      {
        pixelType = PixelTypes.Array;
        break;
      }

    case module.IOPixelType.MATRIX:
      {
        pixelType = PixelTypes.Matrix;
        break;
      }

    case module.IOPixelType.VARIABLELENGTHVECTOR:
      {
        pixelType = PixelTypes.VariableLengthVector;
        break;
      }

    case module.IOPixelType.VARIABLESIZEMATRIX:
      {
        pixelType = PixelTypes.VariableSizeMatrix;
        break;
      }

    default:
      throw new Error('Unknown IO pixel type');
  }

  return pixelType;
};

module.exports = meshIOPixelTypeToJSPixelType;