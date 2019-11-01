var Image = require('./Image.js');

var ImageType = require('./ImageType.js');

var imageIOComponentToJSComponent = require('./imageIOComponentToJSComponent.js');

var imageIOPixelTypeToJSPixelType = require('./imageIOPixelTypeToJSPixelType.js');

var readImageEmscriptenFSDICOMFileSeries = function readImageEmscriptenFSDICOMFileSeries(seriesReaderModule, directory, firstFile) {
  var seriesReader = new seriesReaderModule.ITKDICOMImageSeriesReader();

  if (!seriesReader.CanReadTestFile(firstFile)) {
    throw new Error('Could not read file: ' + firstFile);
  }

  seriesReader.SetTestFileName(firstFile);
  seriesReader.ReadTestImageInformation();
  var dimension = 3;
  var imageType = new ImageType(dimension);
  var ioComponentType = seriesReader.GetIOComponentType();
  imageType.componentType = imageIOComponentToJSComponent(seriesReaderModule, ioComponentType);
  var ioPixelType = seriesReader.GetIOPixelType();
  imageType.pixelType = imageIOPixelTypeToJSPixelType(seriesReaderModule, ioPixelType);
  imageType.components = seriesReader.GetNumberOfComponents();
  var image = new Image(imageType);
  seriesReader.SetIOComponentType(ioComponentType);
  seriesReader.SetIOPixelType(ioPixelType);
  seriesReader.SetDirectory(directory);

  if (seriesReader.Read()) {
    throw new Error('Could not read series');
  }

  for (var ii = 0; ii < dimension; ++ii) {
    image.spacing[ii] = seriesReader.GetSpacing(ii);
    image.size[ii] = seriesReader.GetSize(ii);
    image.origin[ii] = seriesReader.GetOrigin(ii);

    for (var jj = 0; jj < dimension; ++jj) {
      image.direction.setElement(ii, jj, seriesReader.GetDirection(ii, jj));
    }
  }

  image.data = seriesReader.GetPixelBufferData();
  return image;
};

module.exports = readImageEmscriptenFSDICOMFileSeries;