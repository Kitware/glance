var path = require('path');

var loadEmscriptenModule = require('./loadEmscriptenModuleNode.js');

var readDICOMTagsEmscriptenFSFile = require('./readDICOMTagsEmscriptenFSFile.js');
/**
 * Reads DICOM tags from a series of DICOM files on the local filesystem in Node.js.
 * @param: filename DICOM object filepath on the local filesystem.
 * @param: tags Array of tags to extract.
 */


var readDICOMTagsLocalFileSync = function readDICOMTagsLocalFileSync(fileName) {
  var tags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var imageIOsPath = path.resolve(__dirname, 'ImageIOs');
  var tagReader = 'itkDICOMTagReaderJSBinding';
  var tagReaderPath = path.join(imageIOsPath, tagReader);
  var tagReaderModule = loadEmscriptenModule(tagReaderPath);
  var mountedFilePath = tagReaderModule.mountContainingDirectory(fileName);
  var mountedDir = path.dirname(mountedFilePath);
  var mountedFileName = path.join(mountedDir, path.basename(fileName));
  var result = readDICOMTagsEmscriptenFSFile(tagReaderModule, mountedFileName, tags);
  tagReaderModule.unmountContainingDirectory(mountedFilePath);
  return result;
};

module.exports = readDICOMTagsLocalFileSync;