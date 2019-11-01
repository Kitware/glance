var loadEmscriptenModule = require('./loadEmscriptenModuleNode.js');

var runPipelineEmscripten = require('./runPipelineEmscripten.js');

var runPipelineNode = function runPipelineNode(pipelinePath, args, outputs, inputs) {
  return new Promise(function (resolve, reject) {
    try {
      var Module = loadEmscriptenModule(pipelinePath);
      var result = runPipelineEmscripten(Module, args, outputs, inputs);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = runPipelineNode;