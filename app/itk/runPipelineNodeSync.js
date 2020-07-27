var loadEmscriptenModule = require('./loadEmscriptenModuleNode.js');

var runPipelineEmscripten = require('./runPipelineEmscripten.js');

var runPipelineNodeSync = function runPipelineNodeSync(pipelinePath, args, outputs, inputs) {
  var Module = loadEmscriptenModule(pipelinePath);
  var result = runPipelineEmscripten(Module, args, outputs, inputs);
  return result;
};

module.exports = runPipelineNodeSync;