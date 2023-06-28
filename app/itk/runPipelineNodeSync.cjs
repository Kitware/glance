"use strict";

const loadEmscriptenModule = require('./loadEmscriptenModuleNode.js');

const runPipelineEmscripten = require('./runPipelineEmscripten.js');

const runPipelineNodeSync = (pipelinePath, args, outputs, inputs) => {
  const Module = loadEmscriptenModule(pipelinePath);
  const result = runPipelineEmscripten(Module, args, outputs, inputs);
  return result;
};

module.exports = runPipelineNodeSync;