const IntTypes = require('./IntTypes.js')
const FloatTypes = require('./FloatTypes.js')
const PixelTypes = require('./PixelTypes.js')
const getMatrixElement = require('./getMatrixElement.js')

const writeImageEmscriptenFSFile = (module, useCompression, image, filePath) => {
  const imageIO = new module.ITKImageIO()
  imageIO.SetFileName(filePath)
  if (!imageIO.CanWriteFile(filePath)) {
    throw new Error('Could not write file: ' + filePath)
  }

  const dimension = image.imageType.dimension
  imageIO.SetNumberOfDimensions(dimension)

  const componentType = image.imageType.componentType
  switch (componentType) {
    case IntTypes.UInt8: {
      imageIO.SetComponentType(module.IOComponentType.UCHAR)
      break
    }
    case IntTypes.Int8: {
      imageIO.SetComponentType(module.IOComponentType.CHAR)
      break
    }
    case IntTypes.UInt16: {
      imageIO.SetComponentType(module.IOComponentType.USHORT)
      break
    }
    case IntTypes.Int16: {
      imageIO.SetComponentType(module.IOComponentType.SHORT)
      break
    }
    case IntTypes.UInt32: {
      imageIO.SetComponentType(module.IOComponentType.UINT)
      break
    }
    case IntTypes.Int32: {
      imageIO.SetComponentType(module.IOComponentType.INT)
      break
    }
    case IntTypes.UInt64: {
      imageIO.SetComponentType(module.IOComponentType.ULONG)
      break
    }
    case IntTypes.Int64: {
      imageIO.SetComponentType(module.IOComponentType.LONG)
      break
    }
    case FloatTypes.Float32: {
      imageIO.SetComponentType(module.IOComponentType.FLOAT)
      break
    }
    case FloatTypes.Float64: {
      imageIO.SetComponentType(module.IOComponentType.DOUBLE)
      break
    }
    default:
      throw new Error('Unknown IO component type')
  }

  const pixelType = image.imageType.pixelType
  switch (pixelType) {
    case PixelTypes.Unknown: {
      imageIO.SetPixelType(module.IOPixelType.UNKNOWNPIXELTYPE)
      break
    }
    case PixelTypes.Scalar: {
      imageIO.SetPixelType(module.IOPixelType.SCALAR)
      break
    }
    case PixelTypes.RGB: {
      imageIO.SetPixelType(module.IOPixelType.RGB)
      break
    }
    case PixelTypes.RGBA: {
      imageIO.SetPixelType(module.IOPixelType.RGBA)
      break
    }
    case PixelTypes.Offset: {
      imageIO.SetPixelType(module.IOPixelType.OFFSET)
      break
    }
    case PixelTypes.Vector: {
      imageIO.SetPixelType(module.IOPixelType.VECTOR)
      break
    }
    case PixelTypes.Point: {
      imageIO.SetPixelType(module.IOPixelType.POINT)
      break
    }
    case PixelTypes.CovariantVector: {
      imageIO.SetPixelType(module.IOPixelType.COVARIANTVECTOR)
      break
    }
    case PixelTypes.SymmetricSecondRankTensor: {
      imageIO.SetPixelType(module.IOPixelType.SYMMETRICSECONDRANKTENSOR)
      break
    }
    case PixelTypes.DiffusionTensor3D: {
      imageIO.SetPixelType(module.IOPixelType.DIFFUSIONTENSOR3D)
      break
    }
    case PixelTypes.Complex: {
      imageIO.SetPixelType(module.IOPixelType.COMPLEX)
      break
    }
    case PixelTypes.FixedArray: {
      imageIO.SetPixelType(module.IOPixelType.FIXEDARRAY)
      break
    }
    case PixelTypes.Matrix: {
      imageIO.SetPixelType(module.IOPixelType.MATRIX)
      break
    }
    default:
      throw new Error('Unknown IO pixel type')
  }

  imageIO.SetNumberOfComponents(image.imageType.components)

  for (let ii = 0; ii < dimension; ++ii) {
    imageIO.SetDimensions(ii, image.size[ii])
    imageIO.SetSpacing(ii, image.spacing[ii])
    imageIO.SetOrigin(ii, image.origin[ii])
    let directionColumn = new module.AxisDirectionType()
    directionColumn.resize(dimension, 0.0)
    for (let jj = 0; jj < dimension; ++jj) {
      directionColumn.set(jj, getMatrixElement(image.direction, jj, ii))
    }
    imageIO.SetDirection(ii, directionColumn)
  }

  imageIO.SetUseCompression(useCompression)

  // Copy data to Emscripten heap (directly accessed from Module.HEAPU8)
  const numberOfBytes = image.data.length * image.data.BYTES_PER_ELEMENT
  const dataPtr = module._malloc(numberOfBytes)
  const dataHeap = new Uint8Array(module.HEAPU8.buffer, dataPtr, numberOfBytes)
  dataHeap.set(new Uint8Array(image.data.buffer))

  imageIO.Write(dataHeap.byteOffset)

  module._free(dataHeap.byteOffset)
}

module.exports = writeImageEmscriptenFSFile
