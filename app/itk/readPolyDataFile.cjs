"use strict";

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readPolyDataFile = (webWorker, file) => {
  let worker = webWorker;
  return (0, _createWebworkerPromise.default)('Pipeline', worker).then(({
    webworkerPromise,
    worker: usedWorker
  }) => {
    worker = usedWorker;
    return _promiseFileReader.default.readAsArrayBuffer(file).then(arrayBuffer => {
      const filePath = file.name;
      const mimeType = file.type;
      const extension = (0, _getFileExtension.default)(filePath);
      let pipelinePath = null;

      if (_MimeToPolyDataIO.default.has(mimeType)) {
        pipelinePath = _MimeToPolyDataIO.default.get(mimeType);
      } else if (_extensionToPolyDataIO.default.has(extension)) {
        pipelinePath = _extensionToPolyDataIO.default.get(extension);
      }

      if (pipelinePath === null) {
        Promise.reject(Error('Could not find IO for: ' + filePath));
      }

      const args = [file.name, file.name + '.output.json'];
      const outputs = [{
        path: args[1],
        type: _IOTypes.default.vtkPolyData
      }];
      const inputs = [{
        path: args[0],
        type: _IOTypes.default.Binary,
        data: new Uint8Array(arrayBuffer)
      }];
      const transferables = [];
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
        pipelinePath,
        args,
        outputs,
        inputs
      }, transferables).then(function ({
        stdout,
        stderr,
        outputs
      }) {
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