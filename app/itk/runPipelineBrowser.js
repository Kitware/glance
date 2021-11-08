import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _typeof from "@babel/runtime/helpers/typeof";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import axios from 'axios';
import createWebworkerPromise from './createWebworkerPromise';
import config from './itkConfig';
import IOTypes from './IOTypes';
import runPipelineEmscripten from './runPipelineEmscripten';
import getTransferable from './getTransferable'; // To cache loaded pipeline modules

var pipelinePathToModule = {};

function loadEmscriptenModuleMainThread(itkModulesPath, modulesDirectory, pipelinePath, isAbsoluteURL) {
  var prefix = itkModulesPath;

  if (itkModulesPath[0] !== '/' && !itkModulesPath.startsWith('http')) {
    prefix = '..';
  }

  var moduleScriptDir = prefix + '/' + modulesDirectory;

  if (_typeof(window.WebAssembly) === 'object' && typeof window.WebAssembly.Memory === 'function') {
    var modulePath = moduleScriptDir + '/' + pipelinePath + 'Wasm.js';

    if (isAbsoluteURL) {
      modulePath = pipelinePath + 'Wasm.js';
    }

    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = modulePath;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    }).then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var moduleBaseName, wasmPath, response, wasmBinary;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              moduleBaseName = pipelinePath.replace(/.*\//, '');
              wasmPath = moduleScriptDir + '/' + pipelinePath + 'Wasm.wasm';

              if (isAbsoluteURL) {
                wasmPath = pipelinePath + 'Wasm.wasm';
              }

              _context.next = 5;
              return axios.get(wasmPath, {
                responseType: 'arraybuffer'
              });

            case 5:
              response = _context.sent;
              wasmBinary = response.data;
              return _context.abrupt("return", Promise.resolve(window[moduleBaseName]({
                moduleScriptDir: moduleScriptDir,
                isAbsoluteURL: isAbsoluteURL,
                pipelinePath: pipelinePath,
                wasmBinary: wasmBinary
              })));

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
  } else {
    var _modulePath = moduleScriptDir + '/' + pipelinePath + '.js';

    if (isAbsoluteURL) {
      _modulePath = pipelinePath + '.js';
    }

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

function loadPipelineModule(_x, _x2, _x3) {
  return _loadPipelineModule.apply(this, arguments);
}

function _loadPipelineModule() {
  _loadPipelineModule = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(moduleDirectory, pipelinePath, isAbsoluteURL) {
    var pipelineModule;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            pipelineModule = null;

            if (!(pipelinePath in pipelinePathToModule)) {
              _context2.next = 5;
              break;
            }

            pipelineModule = pipelinePathToModule[pipelinePath];
            _context2.next = 9;
            break;

          case 5:
            _context2.next = 7;
            return loadEmscriptenModuleMainThread(config.itkModulesPath, moduleDirectory, pipelinePath, isAbsoluteURL);

          case 7:
            pipelinePathToModule[pipelinePath] = _context2.sent;
            pipelineModule = pipelinePathToModule[pipelinePath];

          case 9:
            return _context2.abrupt("return", pipelineModule);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _loadPipelineModule.apply(this, arguments);
}

var runPipelineBrowser = function runPipelineBrowser(webWorker, pipelinePath, args, outputs, inputs) {
  var isAbsoluteURL = pipelinePath instanceof URL;

  if (webWorker === false) {
    loadPipelineModule('Pipelines', pipelinePath.toString(), isAbsoluteURL).then(function (pipelineModule) {
      var result = runPipelineEmscripten(pipelineModule, args, outputs, inputs);
      return result;
    });
  }

  var worker = webWorker;
  return createWebworkerPromise('Pipeline', worker).then(function (_ref2) {
    var webworkerPromise = _ref2.webworkerPromise,
        usedWorker = _ref2.worker;
    worker = usedWorker;
    var transferables = [];

    if (inputs) {
      inputs.forEach(function (input) {
        if (input.type === IOTypes.Binary) {
          // Binary data
          var transferable = getTransferable(input.data);

          if (transferable) {
            transferables.push(transferable);
          }
        } else if (input.type === IOTypes.Image) {
          // Image data
          var _transferable = getTransferable(input.data.data);

          if (_transferable) {
            transferables.push(_transferable);
          }
        } else if (input.type === IOTypes.Mesh) {
          // Mesh data
          if (input.data.points) {
            var _transferable2 = getTransferable(input.data.points);

            if (_transferable2) {
              transferables.push(_transferable2);
            }
          }

          if (input.data.pointData) {
            var _transferable3 = getTransferable(input.data.pointData);

            if (_transferable3) {
              transferables.push(_transferable3);
            }
          }

          if (input.data.cells) {
            var _transferable4 = getTransferable(input.data.cells);

            if (_transferable4) {
              transferables.push(_transferable4);
            }
          }

          if (input.data.cellData) {
            var _transferable5 = getTransferable(input.data.cellData);

            if (_transferable5) {
              transferables.push(_transferable5);
            }
          }
        }
      });
    }

    return webworkerPromise.postMessage({
      operation: 'runPipeline',
      config: config,
      pipelinePath: pipelinePath.toString(),
      isAbsoluteURL: isAbsoluteURL,
      args: args,
      outputs: outputs,
      inputs: inputs
    }, transferables).then(function (_ref3) {
      var stdout = _ref3.stdout,
          stderr = _ref3.stderr,
          outputs = _ref3.outputs;
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