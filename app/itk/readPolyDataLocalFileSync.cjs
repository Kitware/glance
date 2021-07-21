"use strict";

const path = require('path');

const mime = require('mime-types');

const fs = require('fs');

const mimeToIO = require('./MimeToPolyDataIO.js');

const getFileExtension = require('./getFileExtension.js');

const extensionToIO = require('./extensionToPolyDataIO.js');

const IOTypes = require('./IOTypes.js');

const loadEmscriptenModule = require('./loadEmscriptenModuleNode.js');

const runPipelineEmscripten = require('./runPipelineEmscripten.js');

const readPolyDataLocalFileSync = filePath => {
  const polyDataIOsPath = path.resolve(__dirname, 'PolyDataIOs');
  const absoluteFilePath = path.resolve(filePath);
  const filePathBasename = path.basename(filePath);
  const mimeType = mime.lookup(absoluteFilePath);
  const extension = getFileExtension(absoluteFilePath);
  let io = null;

  if (mimeToIO.has(mimeType)) {
    io = mimeToIO.get(mimeType);
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension);
  }

  if (io === null) {
    throw Error('Could not find IO for: ' + absoluteFilePath);
  }

  const modulePath = path.join(polyDataIOsPath, io);
  const Module = loadEmscriptenModule(modulePath);
  const fileContents = new Uint8Array(fs.readFileSync(absoluteFilePath));
  const args = [filePathBasename, filePathBasename + '.output.json'];
  const desiredOutputs = [{
    path: args[1],
    type: IOTypes.vtkPolyData
  }];
  const inputs = [{
    path: args[0],
    type: IOTypes.Binary,
    data: fileContents
  }];
  const {
    outputs
  } = runPipelineEmscripten(Module, args, desiredOutputs, inputs);
  return outputs[0].data;
};

module.exports = readPolyDataLocalFileSync;