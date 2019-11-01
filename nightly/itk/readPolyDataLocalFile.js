var path = require('path');

var mime = require('mime-types');

var fs = require('fs');

var mimeToIO = require('./MimeToPolyDataIO.js');

var getFileExtension = require('./getFileExtension.js');

var extensionToIO = require('./extensionToPolyDataIO.js');

var IOTypes = require('./IOTypes.js');

var loadEmscriptenModule = require('./loadEmscriptenModuleNode.js');

var runPipelineEmscripten = require('./runPipelineEmscripten.js');

var readPolyDataLocalFile = function readPolyDataLocalFile(filePath) {
  return new Promise(function (resolve, reject) {
    var polyDataIOsPath = path.resolve(__dirname, 'PolyDataIOs');
    var absoluteFilePath = path.resolve(filePath);
    var filePathBasename = path.basename(filePath);

    try {
      var mimeType = mime.lookup(absoluteFilePath);
      var extension = getFileExtension(absoluteFilePath);
      var io = null;

      if (mimeToIO.has(mimeType)) {
        io = mimeToIO.get(mimeType);
      } else if (extensionToIO.has(extension)) {
        io = extensionToIO.get(extension);
      }

      if (io === null) {
        reject(Error('Could not find IO for: ' + absoluteFilePath));
      }

      var modulePath = path.join(polyDataIOsPath, io);
      var Module = loadEmscriptenModule(modulePath);
      var fileContents = new Uint8Array(fs.readFileSync(absoluteFilePath));
      var args = [filePathBasename, filePathBasename + '.output.json'];
      var desiredOutputs = [{
        path: args[1],
        type: IOTypes.vtkPolyData
      }];
      var inputs = [{
        path: args[0],
        type: IOTypes.Binary,
        data: fileContents
      }];

      var _runPipelineEmscripte = runPipelineEmscripten(Module, args, desiredOutputs, inputs),
          outputs = _runPipelineEmscripte.outputs;

      resolve(outputs[0].data);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = readPolyDataLocalFile;