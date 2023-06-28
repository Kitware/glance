"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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
  let prefix = itkModulesPath;

  if (itkModulesPath[0] !== '/' && !itkModulesPath.startsWith('http')) {
    prefix = '..';
  }

  const moduleScriptDir = prefix + '/' + modulesDirectory;

  if (typeof WebAssembly === 'object' && typeof WebAssembly.Memory === 'function') {
    let modulePath = moduleScriptDir + '/' + pipelinePath + 'Wasm.js';

    if (isAbsoluteURL) {
      modulePath = pipelinePath + 'Wasm.js';
    }

    importScripts(modulePath);
    const moduleBaseName = pipelinePath.replace(/.*\//, '');
    const module = self[moduleBaseName]({
      moduleScriptDir,
      isAbsoluteURL,
      pipelinePath
    });
    return module;
  } else {
    let modulePath = moduleScriptDir + '/' + pipelinePath + '.js';

    if (isAbsoluteURL) {
      modulePath = pipelinePath + '.js';
    }

    importScripts(modulePath);
    return Module;
  }
}

var _default = loadEmscriptenModule;
exports.default = _default;