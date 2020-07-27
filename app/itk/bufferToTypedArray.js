var IntTypes = require('./IntTypes.js');

var FloatTypes = require('./FloatTypes.js');

var bufferToTypedArray = function bufferToTypedArray(jsType, buffer) {
  var typedArray = null;

  switch (jsType) {
    case IntTypes.UInt8:
      {
        typedArray = new Uint8Array(buffer);
        break;
      }

    case IntTypes.Int8:
      {
        typedArray = new Int8Array(buffer);
        break;
      }

    case IntTypes.UInt16:
      {
        typedArray = new Uint16Array(buffer);
        break;
      }

    case IntTypes.Int16:
      {
        typedArray = new Int16Array(buffer);
        break;
      }

    case IntTypes.UInt32:
      {
        typedArray = new Uint32Array(buffer);
        break;
      }

    case IntTypes.Int32:
      {
        typedArray = new Int32Array(buffer);
        break;
      }

    case IntTypes.UInt64:
      {
        throw new Error('Type is not supported as a TypedArray');
      }

    case IntTypes.Int64:
      {
        throw new Error('Type is not supported as a TypedArray');
      }

    case FloatTypes.Float32:
      {
        typedArray = new Float32Array(buffer);
        break;
      }

    case FloatTypes.Float64:
      {
        typedArray = new Float64Array(buffer);
        break;
      }

    case 'null':
      {
        typedArray = null;
        break;
      }

    case null:
      {
        typedArray = null;
        break;
      }

    default:
      throw new Error('Type is not supported as a TypedArray');
  }

  return typedArray;
};

module.exports = bufferToTypedArray;