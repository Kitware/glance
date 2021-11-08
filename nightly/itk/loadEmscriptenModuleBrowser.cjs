"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

// Load the Emscripten module in the browser.
//
// If the browser supports WebAssembly, then use the path the the WebAssembly
// wrapper module instead.
//
// If itkModulesPath is a relative Path, then resolve assuming we were called
// from <itkModulesPath>/WebWorkers/, since modules are loaded by the web
// workers.
//
// itkModulesPath is usually taken from './itkConfig', but a different value
// could be passed.
//
// If isAbsoluteURL is `true`, then itkModulesPath is not used, and
// pipelinePath is assumed to be an absoluteURL.
//
// modulesDirectory is one of "ImageIOs", "MeshIOs", or "Pipelines"
//
// pipelinePath is the file name of the emscripten module without the ".js"
// extension
function loadEmscriptenModule(itkModulesPath, modulesDirectory, pipelinePath, isAbsoluteURL) {
  var prefix = itkModulesPath;

  if (itkModulesPath[0] !== '/' && !itkModulesPath.startsWith('http')) {
    prefix = '..';
  }

  var moduleScriptDir = prefix + '/' + modulesDirectory;

  if ((typeof WebAssembly === "undefined" ? "undefined" : (0, _typeof2.default)(WebAssembly)) === 'object' && typeof WebAssembly.Memory === 'function') {
    var modulePath = moduleScriptDir + '/' + pipelinePath + 'Wasm.js';

    if (isAbsoluteURL) {
      modulePath = pipelinePath + 'Wasm.js';
    }

    importScripts(modulePath);
    var moduleBaseName = pipelinePath.replace(/.*\//, '');
    var module = self[moduleBaseName]({
      moduleScriptDir: moduleScriptDir,
      isAbsoluteURL: isAbsoluteURL,
      pipelinePath: pipelinePath
    });
    return module;
  } else {
    var _modulePath = moduleScriptDir + '/' + pipelinePath + '.js';

    if (isAbsoluteURL) {
      _modulePath = pipelinePath + '.js';
    }

    importScripts(_modulePath);
    return Module;
  }
}

var _default = loadEmscriptenModule;
exports.default = _default;