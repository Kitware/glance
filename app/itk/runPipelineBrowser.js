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
        } // Image data


        if (input.type === IOTypes.Image) {
          if (input.data.data.buffer) {
            transferables.push(input.data.data.buffer);
          } else if (input.data.data.byteLength) {
            transferables.push(input.data.data);
          }
        } // Mesh data


        if (input.type === IOTypes.Mesh) {
          if (input.data.points) {
            if (input.data.points.buffer) {
              transferables.push(input.data.points.buffer);
            } else if (input.data.points.byteLength) {
              transferables.push(input.data.points);
            }
          }

          if (input.data.pointData) {
            if (input.data.pointData.buffer) {
              transferables.push(input.data.pointData.buffer);
            } else if (input.data.pointData.byteLength) {
              transferables.push(input.data.pointData);
            }
          }

          if (input.data.cells) {
            if (input.data.cells.buffer) {
              transferables.push(input.data.cells.buffer);
            } else if (input.data.cells.byteLength) {
              transferables.push(input.data.cells);
            }
          }

          if (input.data.cellData) {
            if (input.data.cellData.buffer) {
              transferables.push(input.data.cellData.buffer);
            } else if (input.data.cellData.byteLength) {
              transferables.push(input.data.cellData);
            }
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
      return Promise.resolve({
        stdout: stdout,
        stderr: stderr,
        outputs: outputs,
        webWorker: worker
      });
    });
  });
};

export default runPipelineBrowser;