import createWebworkerPromise from './createWebworkerPromise';

import config from './itkConfig';

import IOTypes from './IOTypes';

var runPipelineBrowser = function runPipelineBrowser(webWorker, pipelinePath, args, outputs, inputs) {
  var worker = webWorker;
  return createWebworkerPromise('Pipeline', worker).then(function (_ref) {
    var webworkerPromise = _ref.webworkerPromise,
        usedWorker = _ref.worker;

    worker = usedWorker;
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
    return webworkerPromise.postMessage({
      operation: 'runPipeline',
      config: config,
      pipelinePath: pipelinePath,
      args: args,
      outputs: outputs,
      inputs: inputs
    }, transferables).then(function (_ref2) {
      var stdout = _ref2.stdout,
          stderr = _ref2.stderr,
          outputs = _ref2.outputs;

      return Promise.resolve({ stdout: stdout, stderr: stderr, outputs: outputs, webWorker: worker });
    });
  });
};

export default runPipelineBrowser;