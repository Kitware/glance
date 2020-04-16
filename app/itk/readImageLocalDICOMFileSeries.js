var path = require('path');

var loadEmscriptenModule = require('./loadEmscriptenModuleNode.js');

var readImageEmscriptenFSDICOMFileSeries = require('./readImageEmscriptenFSDICOMFileSeries.js');
/**
 * Read an image from a series of DICOM files on the local filesystem in Node.js.
 *
 * @param: filenames Array of filepaths containing a DICOM study / series on the local filesystem.
 * @param: singleSortedSeries: it is known that the files are from a single
 * sorted series.
 */


var readImageLocalDICOMFileSeries = function readImageLocalDICOMFileSeries(fileNames) {
  var singleSortedSeries = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return new Promise(function (resolve, reject) {
    var imageIOsPath = path.resolve(__dirname, 'ImageIOs');
    var seriesReader = 'itkDICOMImageSeriesReaderJSBinding';

    try {
      var seriesReaderPath = path.join(imageIOsPath, seriesReader);
      var seriesReaderModule = loadEmscriptenModule(seriesReaderPath);
      var mountedFilePath = seriesReaderModule.mountContainingDirectory(fileNames[0]);
      var mountedDir = path.dirname(mountedFilePath);
      var mountedFileNames = fileNames.map(function (fileName) {
        return path.join(mountedDir, path.basename(fileName));
      });
      var image = readImageEmscriptenFSDICOMFileSeries(seriesReaderModule, mountedFileNames, singleSortedSeries);
      seriesReaderModule.unmountContainingDirectory(mountedFilePath);
      resolve(image);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = readImageLocalDICOMFileSeries;