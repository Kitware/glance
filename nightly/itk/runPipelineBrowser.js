import WebworkerPromise from 'webworker-promise';

import config from './itkConfig';

import IOTypes from './IOTypes';

var worker = new window.Worker(config.itkModulesPath + '/WebWorkers/Pipeline.worker.js');
var promiseWorker = new WebworkerPromise(worker);

var runPipelineBrowser = function runPipelineBrowser(pipelinePath, args, outputs, inputs) {
  var transferables = [];
  if (inputs) {
    inputs.forEach(function (input) {
      // Binary data
      if (input.type === IOTypes.Binary) {
        if (input.data.buffer) {
          transferables.push(input.data.buffer);
        } else if (input.data.byteLength) {
          transferables.push(input.data);
        }
      }
      // Image data
      if (input.type === IOTypes.Image) {
        if (input.data.data.buffer) {
          transferables.push(input.data.data.buffer);
        } else if (input.data.data.byteLength) {
          transferables.push(input.data.data);
        }
      }
    });
  }
  return promiseWorker.postMessage({
    operation: 'runPipeline',
    config: config,
    pipelinePath: pipelinePath,
    args: args,
    outputs: outputs,
    inputs: inputs
  }, transferables);
};

export default runPipelineBrowser;