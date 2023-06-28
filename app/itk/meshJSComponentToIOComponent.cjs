"use strict";

const IntTypes = require('./IntTypes.js');

const FloatTypes = require('./FloatTypes.js');

const meshJSComponentToIOComponent = (module, componentType) => {
  let ioComponentType = null;

  switch (componentType) {
    case null:
      {
        ioComponentType = module.IOComponentType.UNKNOWNCOMPONENTTYPE;
        break;
      }

    case IntTypes.UInt8:
      {
        ioComponentType = module.IOComponentType.UCHAR;
        break;
      }

    case IntTypes.Int8:
      {
        ioComponentType = module.IOComponentType.CHAR;
        break;
      }

    case IntTypes.UInt16:
      {
        ioComponentType = module.IOComponentType.USHORT;
        break;
      }

    case IntTypes.Int16:
      {
        ioComponentType = module.IOComponentType.SHORT;
        break;
      }

    case IntTypes.UInt32:
      {
        ioComponentType = module.IOComponentType.UINT;
        break;
      }

    case IntTypes.Int32:
      {
        ioComponentType = module.IOComponentType.INT;
        break;
      }

    case IntTypes.UInt64:
      {
        ioComponentType = module.IOComponentType.ULONGLONG;
        break;
      }

    case IntTypes.Int64:
      {
        ioComponentType = module.IOComponentType.LONGLONG;
        break;
      }

    case FloatTypes.Float32:
      {
        ioComponentType = module.IOComponentType.FLOAT;
        break;
      }

    case FloatTypes.Float64:
      {
        ioComponentType = module.IOComponentType.DOUBLE;
        break;
      }

    default:
      throw new Error('Unknown IO component type');
  }

  return ioComponentType;
};

module.exports = meshJSComponentToIOComponent;