"use strict";

const loadEmscriptenModuleNode = modulePath => {
  const result = require(modulePath);

  return result;
};

module.exports = loadEmscriptenModuleNode;