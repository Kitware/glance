import _typeof from "@babel/runtime/helpers/typeof";

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
function loadEmscriptenModule(itkModulesPath, modulesDirectory, moduleBaseName) {
  var prefix = itkModulesPath;

  if (itkModulesPath[0] !== '/' && !itkModulesPath.startsWith('http')) {
    prefix = '..';
  }

  if ((typeof WebAssembly === "undefined" ? "undefined" : _typeof(WebAssembly)) === 'object' && typeof WebAssembly.Memory === 'function') {
    var modulePath = prefix + '/' + modulesDirectory + '/' + moduleBaseName + 'Wasm.js';
    importScripts(modulePath);
    var module = self[moduleBaseName]();
    return module;
  } else {
    var _modulePath = prefix + '/' + modulesDirectory + '/' + moduleBaseName + '.js';

    importScripts(_modulePath);
    return Module;
  }
}

export default loadEmscriptenModule;