var PixelTypes = require('./PixelTypes.js');

var imageJSPixelTypeToIOPixelType = function imageJSPixelTypeToIOPixelType(module, pixelType) {
  var ioPixelType = null;

  switch (pixelType) {
    case PixelTypes.Unknown:
      {
        ioPixelType = module.IOPixelType.UNKNOWNPIXELTYPE;
        break;
      }

    case PixelTypes.Scalar:
      {
        ioPixelType = module.IOPixelType.SCALAR;
        break;
      }

    case PixelTypes.RGB:
      {
        ioPixelType = module.IOPixelType.RGB;
        break;
      }

    case PixelTypes.RGBA:
      {
        ioPixelType = module.IOPixelType.RGBA;
        break;
      }

    case PixelTypes.Offset:
      {
        ioPixelType = module.IOPixelType.OFFSET;
        break;
      }

    case PixelTypes.Vector:
      {
        ioPixelType = module.IOPixelType.VECTOR;
        break;
      }

    case PixelTypes.Point:
      {
        ioPixelType = module.IOPixelType.POINT;
        break;
      }

    case PixelTypes.CovariantVector:
      {
        ioPixelType = module.IOPixelType.COVARIANTVECTOR;
        break;
      }

    case PixelTypes.SymmetricSecondRankTensor:
      {
        ioPixelType = module.IOPixelType.SYMMETRICSECONDRANKTENSOR;
        break;
      }

    case PixelTypes.DiffusionTensor3D:
      {
        ioPixelType = module.IOPixelType.DIFFUSIONTENSOR3D;
        break;
      }

    case PixelTypes.Complex:
      {
        ioPixelType = module.IOPixelType.COMPLEX;
        break;
      }

    case PixelTypes.FixedArray:
      {
        ioPixelType = module.IOPixelType.FIXEDARRAY;
        break;
      }

    case PixelTypes.Matrix:
      {
        ioPixelType = module.IOPixelType.MATRIX;
        break;
      }

    default:
      throw new Error('Unknown IO pixel type');
  }

  return ioPixelType;
};

module.exports = imageJSPixelTypeToIOPixelType;