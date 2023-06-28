"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _createWebworkerPromise = _interopRequireDefault(require("./createWebworkerPromise"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

var _IOTypes = _interopRequireDefault(require("./IOTypes"));

var _runPipelineEmscripten = _interopRequireDefault(require("./runPipelineEmscripten"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// To cache loaded pipeline modules
const pipelinePathToModule = {};

function loadEmscriptenModuleMainThread(itkModulesPath, modulesDirectory, pipelinePath, isAbsoluteURL) {
  let prefix = itkModulesPath;

  if (itkModulesPath[0] !== '/' && !itkModulesPath.startsWith('http')) {
    prefix = '..';
  }

  const moduleScriptDir = prefix + '/' + modulesDirectory;

  if (typeof window.WebAssembly === 'object' && typeof window.WebAssembly.Memory === 'function') {
    let modulePath = moduleScriptDir + '/' + pipelinePath + 'Wasm.js';

    if (isAbsoluteURL) {
      modulePath = pipelinePath + 'Wasm.js';
    }

    return new Promise(function (resolve, reject) {
      const s = document.createElement('script');
      s.src = modulePath;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    }).then(async () => {
      const moduleBaseName = pipelinePath.replace(/.*\//, '');
      let wasmPath = moduleScriptDir + '/' + pipelinePath + 'Wasm.wasm';

      if (isAbsoluteURL) {
        wasmPath = pipelinePath + 'Wasm.wasm';
      }

      const response = await _axios.default.get(wasmPath, {
        responseType: 'arraybuffer'
      });
      const wasmBinary = response.data;
      return Promise.resolve(window[moduleBaseName]({
        moduleScriptDir,
        isAbsoluteURL,
        pipelinePath,
        wasmBinary
      }));
    });
  } else {
    let modulePath = moduleScriptDir + '/' + pipelinePath + '.js';

    if (isAbsoluteURL) {
      modulePath = pipelinePath + '.js';
    }

    return new Promise(function (resolve, reject) {
      const s = document.createElement('script');
      s.src = modulePath;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    }).then(() => {
      const module = window.Module;
      return module;
    });
  }
}

async function loadPipelineModule(moduleDirectory, pipelinePath, isAbsoluteURL) {
  let pipelineModule = null;

  if (pipelinePath in pipelinePathToModule) {
    pipelineModule = pipelinePathToModule[pipelinePath];
  } else {
    pipelinePathToModule[pipelinePath] = await loadEmscriptenModuleMainThread(_itkConfig.default.itkModulesPath, moduleDirectory, pipelinePath, isAbsoluteURL);
    pipelineModule = pipelinePathToModule[pipelinePath];
  }

  return pipelineModule;
}

const haveSharedArrayBuffer = typeof window.SharedArrayBuffer === 'function';

function getTransferable(data) {
  let result = null;

  if (data.buffer) {
    result = data.buffer;
  } else if (data.byteLength) {
    result = data;
  }

  if (!!result && haveSharedArrayBuffer && result instanceof SharedArrayBuffer) {
    // eslint-disable-line
    result = null;
  }

  return result;
}

const runPipelineBrowser = (webWorker, pipelinePath, args, outputs, inputs) => {
  const isAbsoluteURL = pipelinePath instanceof URL;

  if (webWorker === false) {
    loadPipelineModule('Pipelines', pipelinePath.toString(), isAbsoluteURL).then(pipelineModule => {
      const result = (0, _runPipelineEmscripten.default)(pipelineModule, args, outputs, inputs);
      return result;
    });
  }

  let worker = webWorker;
  return (0, _createWebworkerPromise.default)('Pipeline', worker).then(({
    webworkerPromise,
    worker: usedWorker
  }) => {
    worker = usedWorker;
    const transferables = [];

    if (inputs) {
      inputs.forEach(function (input) {
        // Binary data
        if (input.type === _IOTypes.default.Binary) {
          const transferable = getTransferable(input.data);

          if (transferable) {
            transferables.push(transferable);
          }
        } // Image data


        if (input.type === _IOTypes.default.Image) {
          const transferable = getTransferable(input.data.data);

          if (transferable) {
            transferables.push(transferable);
          }
        } // Mesh data


        if (input.type === _IOTypes.default.Mesh) {
          if (input.data.points) {
            const transferable = getTransferable(input.data.points);

            if (transferable) {
              transferables.push(transferable);
            }
          }

          if (input.data.pointData) {
            const transferable = getTransferable(input.data.pointData);

            if (transferable) {
              transferables.push(transferable);
            }
          }

          if (input.data.cells) {
            const transferable = getTransferable(input.data.cells);

            if (transferable) {
              transferables.push(transferable);
            }
          }

          if (input.data.cellData) {
            const transferable = getTransferable(input.data.cellData);

            if (transferable) {
              transferables.push(transferable);
            }
          }
        }
      });
    }

    return webworkerPromise.postMessage({
      operation: 'runPipeline',
      config: _itkConfig.default,
      pipelinePath: pipelinePath.toString(),
      isAbsoluteURL,
      args,
      outputs,
      inputs
    }, transferables).then(function ({
      stdout,
      stderr,
      outputs
    }) {
      return Promise.resolve({
        stdout,
        stderr,
        outputs,
        webWorker: worker
      });
    });
  });
};

var _default = runPipelineBrowser;
exports.default = _default;