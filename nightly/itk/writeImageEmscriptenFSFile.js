var getMatrixElement = require('./getMatrixElement.js');

var imageJSComponentToIOComponent = require('./imageJSComponentToIOComponent.js');

var imageJSPixelTypeToIOPixelType = require('./imageJSPixelTypeToIOPixelType.js');

var writeImageEmscriptenFSFile = function writeImageEmscriptenFSFile(module, useCompression, image, filePath) {
  var imageIO = new module.ITKImageIO();
  imageIO.SetFileName(filePath);

  if (!imageIO.CanWriteFile(filePath)) {
    throw new Error('Could not write file: ' + filePath);
  }

  var dimension = image.imageType.dimension;
  imageIO.SetNumberOfDimensions(dimension);
  var ioComponentType = imageJSComponentToIOComponent(module, image.imageType.componentType);
  imageIO.SetComponentType(ioComponentType);
  var ioPixelType = imageJSPixelTypeToIOPixelType(module, image.imageType.pixelType);
  imageIO.SetPixelType(ioPixelType);
  imageIO.SetNumberOfComponents(image.imageType.components);

  for (var ii = 0; ii < dimension; ++ii) {
    imageIO.SetDimensions(ii, image.size[ii]);
    imageIO.SetSpacing(ii, image.spacing[ii]);
    imageIO.SetOrigin(ii, image.origin[ii]);
    var directionColumn = new module.AxisDirectionType();
    directionColumn.resize(dimension, 0.0);

    for (var jj = 0; jj < dimension; ++jj) {
      directionColumn.set(jj, getMatrixElement(image.direction, jj, ii));
    }

    imageIO.SetDirection(ii, directionColumn);
  }

  imageIO.SetUseCompression(useCompression); // Copy data to Emscripten heap (directly accessed from Module.HEAPU8)

  var numberOfBytes = image.data.length * image.data.BYTES_PER_ELEMENT;

  var dataPtr = module._malloc(numberOfBytes);

  var dataHeap = new Uint8Array(module.HEAPU8.buffer, dataPtr, numberOfBytes);
  dataHeap.set(new Uint8Array(image.data.buffer)); // The ImageIO's also call WriteImageInformation() because
  // itk::ImageFileWriter only calls Write()

  imageIO.Write(dataHeap.byteOffset);

  module._free(dataHeap.byteOffset);
};

module.exports = writeImageEmscriptenFSFile;