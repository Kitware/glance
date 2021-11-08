var readDICOMTagsLocalFileSync = require('./readDICOMTagsLocalFileSync.js');

var readDICOMTagsLocalFile = function readDICOMTagsLocalFile(filename) {
  var tags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return new Promise(function (resolve, reject) {
    try {
      resolve(readDICOMTagsLocalFileSync(filename, tags));
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = readDICOMTagsLocalFile;