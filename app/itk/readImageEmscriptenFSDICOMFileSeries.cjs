"use strict";

const Image = require('./Image.js');

const ImageType = require('./ImageType.js');

const imageIOComponentToJSComponent = require('./imageIOComponentToJSComponent.js');

const imageIOPixelTypeToJSPixelType = require('./imageIOPixelTypeToJSPixelType.js');

const readImageEmscriptenFSDICOMFileSeries = (seriesReaderModule, fileNames, singleSortedSeries) => {
  const seriesReader = new seriesReaderModule.ITKDICOMImageSeriesReader();
  const firstFile = fileNames[0];

  if (!seriesReader.CanReadTestFile(firstFile)) {
    throw new Error('Could not read file: ' + firstFile);
  }

  seriesReader.SetTestFileName(firstFile);
  seriesReader.ReadTestImageInformation();
  const dimension = 3;
  const imageType = new ImageType(dimension);
  const ioComponentType = seriesReader.GetIOComponentType();
  imageType.componentType = imageIOComponentToJSComponent(seriesReaderModule, ioComponentType);
  const ioPixelType = seriesReader.GetIOPixelType();
  imageType.pixelType = imageIOPixelTypeToJSPixelType(seriesReaderModule, ioPixelType);
  imageType.components = seriesReader.GetNumberOfComponents();
  const image = new Image(imageType);
  seriesReader.SetIOComponentType(ioComponentType);
  seriesReader.SetIOPixelType(ioPixelType);
  const fileNamesContainer = new seriesReaderModule.FileNamesContainerType();
  fileNames.forEach(fileName => {
    fileNamesContainer.push_back(fileName);
  });

  if (singleSortedSeries) {
    seriesReader.SetFileNames(fileNamesContainer);
  } else {
    const directory = fileNames[0].match(/.*\//)[0];
    seriesReader.SetDirectory(directory);
  }

  if (seriesReader.Read()) {
    throw new Error('Could not read series');
  }

  for (let ii = 0; ii < dimension; ++ii) {
    image.spacing[ii] = seriesReader.GetSpacing(ii);
    image.size[ii] = seriesReader.GetSize(ii);
    image.origin[ii] = seriesReader.GetOrigin(ii);

    for (let jj = 0; jj < dimension; ++jj) {
      image.direction.setElement(ii, jj, seriesReader.GetDirection(ii, jj));
    }
  }

  image.data = seriesReader.GetPixelBufferData();
  seriesReader.DeleteImage();
  return image;
};

module.exports = readImageEmscriptenFSDICOMFileSeries;