function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Load the Emscripten module in the browser.
//
// If the browser supports WebAssembly, then use the path the the WebAssembly
// wrapper module instead.
//
// If itkModulesPath is a relative Path, then resolve assuming we were called
// from <itkModulesPath>/WebWorkers/, since modules are loaded by the web
// workers.
//
//
// itkModulesPath is usually taken from './itkConfig', but a different value
// could be passed.
//
// modulesDirectory is one of "ImageIOs", "MeshIOs", or "Pipelines"
//
// moduleBaseName is the file name of the emscripten module without the ".js"
// extension
var loadEmscriptenModule = function loadEmscriptenModule(itkModulesPath, modulesDirectory, moduleBaseName) {
  var prefix = itkModulesPath;

  if (itkModulesPath[0] !== '/' && !itkModulesPath.startsWith('http')) {
    prefix = '..';
  }

  var modulePath = prefix + '/' + modulesDirectory + '/' + moduleBaseName + '.js';

  if ((typeof WebAssembly === "undefined" ? "undefined" : _typeof(WebAssembly)) === 'object' && typeof WebAssembly.Memory === 'function') {
    modulePath = prefix + '/' + modulesDirectory + '/' + moduleBaseName + 'Wasm.js';
  }

  importScripts(modulePath);
  return Module;
};

export default loadEmscriptenModule;