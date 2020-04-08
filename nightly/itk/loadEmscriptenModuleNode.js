var loadEmscriptenModuleNode = function loadEmscriptenModuleNode(modulePath) {
  var result = require(modulePath);

  return result;
};

module.exports = loadEmscriptenModuleNode;