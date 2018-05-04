var Module = {}

Module['locateFile'] = function(fileName) {
  if(fileName === 'InputOutputFilesWasm.wasm') {
    return '../Pipelines/InputOutputFilesWasm.wasm'
  }
  return fileName
}

var moduleStdout = null
var moduleStderr = null

Module['resetModuleStdout'] = function() {
  moduleStdout = ''
}

Module['resetModuleStderr'] = function() {
  moduleStderr = ''
}

Module['print'] = function(text) {
  console.log(text)
  moduleStdout += text + '\n'
}

Module['printErr'] = function(text) {
  console.log(text)
  moduleStderr += text + '\n'
}

Module['getModuleStdout'] = function() {
  return moduleStdout
}

Module['getModuleStderr'] = function() {
  return moduleStderr
}
