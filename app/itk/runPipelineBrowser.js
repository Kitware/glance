import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _typeof from "@babel/runtime/helpers/typeof";
import createWebworkerPromise from './createWebworkerPromise';
import config from './itkConfig';
import IOTypes from './IOTypes';
import runPipelineEmscripten from './runPipelineEmscripten'; // To cache loaded pipeline modules

var pipelinePathToModule = {};

function loadEmscriptenModuleMainThread(itkModulesPath, modulesDirectory, moduleBaseName) {
  var prefix = itkModulesPath;

  if (itkModulesPath[0] !== '/' && !itkModulesPath.startsWith('http')) {
    prefix = '..';
  }

  if (_typeof(window.WebAssembly) === 'object' && typeof window.WebAssembly.Memory === 'function') {
    var modulePath = prefix + '/' + modulesDirectory + '/' + moduleBaseName + 'Wasm.js';
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = modulePath;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    }).then(function () {
      var module = window[moduleBaseName]();
      return module;
    });
  } else {
    var _modulePath = prefix + '/' + modulesDirectory + '/' + moduleBaseName + '.js';

    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = _modulePath;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    }).then(function () {
      var module = window.Module;
      return module;
    });
  }
}

function loadPipelineModule(_x, _x2) {
  return _loadPipelineModule.apply(this, arguments);
}

function _loadPipelineModule() {
  _loadPipelineModule = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(moduleDirectory, pipelinePath) {
    var pipelineModule;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            pipelineModule = null;

            if (!(pipelinePath in pipelinePathToModule)) {
              _context.next = 5;
              break;
            }

            pipelineModule = pipelinePathToModule[pipelinePath];
            _context.next = 9;
            break;

          case 5:
            _context.next = 7;
            return loadEmscriptenModuleMainThread(config.itkModulesPath, moduleDirectory, pipelinePath);

          case 7:
            pipelinePathToModule[pipelinePath] = _context.sent;
            pipelineModule = pipelinePathToModule[pipelinePath];

          case 9:
            return _context.abrupt("return", pipelineModule);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _loadPipelineModule.apply(this, arguments);
}

var runPipelineBrowser = function runPipelineBrowser(webWorker, pipelinePath, args, outputs, inputs) {
  if (webWorker === false) {
    loadPipelineModule('Pipelines', pipelinePath).then(function (pipelineModule) {
      var result = runPipelineEmscripten(pipelineModule, args, outputs, inputs);
      return result;
    });
  }

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