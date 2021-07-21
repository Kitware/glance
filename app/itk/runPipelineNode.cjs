"use strict";

const loadEmscriptenModule = require('./loadEmscriptenModuleNode.js');

const runPipelineEmscripten = require('./runPipelineEmscripten.js');

const runPipelineNode = (pipelinePath, args, outputs, inputs) => {
  return new Promise(function (resolve, reject) {
    try {
      const Module = loadEmscriptenModule(pipelinePath);
      const result = runPipelineEmscripten(Module, args, outputs, inputs);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = runPipelineNode;