"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createWebworkerPromise = _interopRequireDefault(require("./createWebworkerPromise"));

var _promiseFileReader = _interopRequireDefault(require("promise-file-reader"));

var _MimeToPolyDataIO = _interopRequireDefault(require("./MimeToPolyDataIO"));

var _getFileExtension = _interopRequireDefault(require("./getFileExtension"));

var _extensionToPolyDataIO = _interopRequireDefault(require("./extensionToPolyDataIO"));

var _IOTypes = _interopRequireDefault(require("./IOTypes"));

var _itkConfig = _interopRequireDefault(require("./itkConfig"));

var readPolyDataFile = function readPolyDataFile(webWorker, file) {
  var worker = webWorker;
  return (0, _createWebworkerPromise.default)('Pipeline', worker).then(function (_ref) {
    var webworkerPromise = _ref.webworkerPromise,
        usedWorker = _ref.worker;
    worker = usedWorker;
    return _promiseFileReader.default.readAsArrayBuffer(file).then(function (arrayBuffer) {
      var filePath = file.name;
      var mimeType = file.type;
      var extension = (0, _getFileExtension.default)(filePath);
      var pipelinePath = null;

      if (_MimeToPolyDataIO.default.has(mimeType)) {
        pipelinePath = _MimeToPolyDataIO.default.get(mimeType);
      } else if (_extensionToPolyDataIO.default.has(extension)) {
        pipelinePath = _extensionToPolyDataIO.default.get(extension);
      }

      if (pipelinePath === null) {
        Promise.reject(Error('Could not find IO for: ' + filePath));
      }

      var args = [file.name, file.name + '.output.json'];
      var outputs = [{
        path: args[1],
        type: _IOTypes.default.vtkPolyData
      }];
      var inputs = [{
        path: args[0],
        type: _IOTypes.default.Binary,
        data: new Uint8Array(arrayBuffer)
      }];
      var transferables = [];
      inputs.forEach(function (input) {
        // Binary data
        if (input.type === _IOTypes.default.Binary) {
          if (input.data.buffer) {
            transferables.push(input.data.buffer);
          } else if (input.data.byteLength) {
            transferables.push(input.data);
          }
        }
      });
      return webworkerPromise.postMessage({
        operation: 'runPolyDataIOPipeline',
        config: _itkConfig.default,
        pipelinePath: pipelinePath,
        args: args,
        outputs: outputs,
        inputs: inputs
      }, transferables).then(function (_ref2) {
        var stdout = _ref2.stdout,
            stderr = _ref2.stderr,
            outputs = _ref2.outputs;
        return Promise.resolve({
          polyData: outputs[0].data,
          webWorker: worker
        });
      });
    });
  });
};

var _default = readPolyDataFile;
exports.default = _default;