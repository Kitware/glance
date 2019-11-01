var Image = require('./Image.js');

var ImageType = require('./ImageType.js');

var Matrix = require('./Matrix.js');

var imageIOComponentToJSComponent = require('./imageIOComponentToJSComponent.js');

var imageIOPixelTypeToJSPixelType = require('./imageIOPixelTypeToJSPixelType.js');

var readImageEmscriptenFSFile = function readImageEmscriptenFSFile(module, filePath) {
  var imageIO = new module.ITKImageIO();
  imageIO.SetFileName(filePath);

  if (!imageIO.CanReadFile(filePath)) {
    throw new Error('Could not read file: ' + filePath);
  }

  imageIO.ReadImageInformation();
  var ioDimensions = imageIO.GetNumberOfDimensions();
  var imageType = new ImageType(ioDimensions);
  var ioComponentType = imageIO.GetComponentType();
  imageType.componentType = imageIOComponentToJSComponent(module, ioComponentType);
  var ioPixelType = imageIO.GetPixelType();
  imageType.pixelType = imageIOPixelTypeToJSPixelType(module, ioPixelType);
  imageType.components = imageIO.GetNumberOfComponents();
  var image = new Image(imageType);
  var ioDirection = new Matrix(ioDimensions, ioDimensions);

  for (var ii = 0; ii < ioDimensions; ++ii) {
    var directionColumn = imageIO.GetDirection(ii);

    for (var jj = 0; jj < ioDimensions; ++jj) {
      ioDirection.setElement(jj, ii, directionColumn.get(jj));
    }
  }

  for (var _ii = 0; _ii < image.imageType.dimension; ++_ii) {
    if (_ii < ioDimensions) {
      image.size[_ii] = imageIO.GetDimensions(_ii);
      image.spacing[_ii] = imageIO.GetSpacing(_ii);
      image.origin[_ii] = imageIO.GetOrigin(_ii);

      for (var _jj = 0; _jj < image.imageType.dimension; ++_jj) {
        if (_jj < ioDimensions) {
          var element = ioDirection.getElement(_jj, _ii);
          image.direction.setElement(_jj, _ii, element);
        } else {
          image.direction.setElement(_jj, _ii, 0.0);
        }
      }
    } else {
      image.size[_ii] = 0;
      image.spacing[_ii] = 1.0;
      image.origin[_ii] = 0.0;
      image.direction.setIdentity();
    }
  } // Spacing is expected to be greater than 0
  // If negative, flip image direction along this axis.


  for (var _ii2 = 0; _ii2 < image.imageType.dimension; ++_ii2) {
    if (image.spacing[_ii2] < 0.0) {
      image.spacing[_ii2] = -image.spacing[_ii2];

      for (var _jj2 = 0; _jj2 < image.imageType.dimension; ++_jj2) {
        image.direction.setElement(_ii2, _jj2, -1 * image.direction.getElement(_ii2, _jj2));
      }
    }
  }

  image.data = imageIO.Read();
  return image;
};

module.exports = readImageEmscriptenFSFile;