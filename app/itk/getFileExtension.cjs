"use strict";

const getFileExtension = filePath => {
  let extension = filePath.slice((filePath.lastIndexOf('.') - 1 >>> 0) + 2);

  if (extension.toLowerCase() === 'gz') {
    const index = filePath.slice(0, -3).lastIndexOf('.');
    extension = filePath.slice((index - 1 >>> 0) + 2);
  }

  return extension;
};

module.exports = getFileExtension;