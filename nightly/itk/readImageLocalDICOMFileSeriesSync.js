var path = require('path');

var fs = require('fs');

var loadEmscriptenModule = require('./loadEmscriptenModuleNode.js');

var readImageEmscriptenFSDICOMFileSeries = require('./readImageEmscriptenFSDICOMFileSeries.js');
/**
 * Read an image from a series of DICOM files on the local filesystem in Node.js.
 *
 * It is assumed that all the files are located in the same directory.
 *
 * @param: directory a directory containing a single study / series on the local filesystem.
 */


var readImageLocalDICOMFileSeriesSync = function readImageLocalDICOMFileSeriesSync(directory) {
  var imageIOsPath = path.resolve(__dirname, 'ImageIOs');
  var absoluteDirectory = path.resolve(directory);
  var seriesReader = 'itkDICOMImageSeriesReaderJSBinding';
  var files = fs.readdirSync(absoluteDirectory);
  var absoluteDirectoryWithFile = path.join(absoluteDirectory, 'myfile.dcm');
  var seriesReaderPath = path.join(imageIOsPath, seriesReader);
  var seriesReaderModule = loadEmscriptenModule(seriesReaderPath);
  var mountedFilePath = seriesReaderModule.mountContainingDirectory(absoluteDirectoryWithFile);
  var mountedDir = path.dirname(mountedFilePath);
  var image = readImageEmscriptenFSDICOMFileSeries(seriesReaderModule, mountedDir, mountedDir + '/' + files[0]);
  seriesReaderModule.unmountContainingDirectory(mountedFilePath);
  return image;
};

module.exports = readImageLocalDICOMFileSeriesSync;