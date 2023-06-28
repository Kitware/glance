var IOTypes = require('./IOTypes.js');

var bufferToTypedArray = require('./bufferToTypedArray.js');

var typedArrayForBuffer = function typedArrayForBuffer(typedArrayType, buffer) {
  var TypedArrayFunction = null;

  if (typeof window !== 'undefined') {
    // browser
    TypedArrayFunction = window[typedArrayType];
  } else {
    // Node.js
    TypedArrayFunction = global[typedArrayType];
  }

  return new TypedArrayFunction(buffer);
};

var runPipelineEmscripten = function runPipelineEmscripten(pipelineModule, args, outputs, inputs) {
  if (inputs) {
    inputs.forEach(function (input) {
      switch (input.type) {
        case IOTypes.Text:
          {
            pipelineModule.writeFile(input.path, input.data);
            break;
          }

        case IOTypes.Binary:
          {
            pipelineModule.writeFile(input.path, input.data);
            break;
          }

        case IOTypes.Image:
          {
            var imageJSON = {};

            for (var key in input.data) {
              if (Object.prototype.hasOwnProperty.call(input.data, key) && key !== 'data') {
                imageJSON[key] = input.data[key];
              }
            }

            imageJSON.data = input.path + '.data';
            pipelineModule.writeFile(input.path, JSON.stringify(imageJSON));
            pipelineModule.writeFile(imageJSON.data, new Uint8Array(input.data.data.buffer));
            break;
          }

        case IOTypes.Mesh:
          {
            var meshJSON = {};

            for (var _key in input.data) {
              if (Object.prototype.hasOwnProperty.call(input.data, _key) && _key !== 'points' && _key !== 'pointData' && _key !== 'cells' && _key !== 'cellData') {
                meshJSON[_key] = input.data[_key];
              }
            }

            meshJSON.points = input.path + '.points.data';
            meshJSON.pointData = input.path + '.pointData.data';
            meshJSON.cells = input.path + '.cells.data';
            meshJSON.cellData = input.path + '.cellData.data';
            pipelineModule.writeFile(input.path, JSON.stringify(meshJSON));

            if (meshJSON.numberOfPoints) {
              pipelineModule.writeFile(meshJSON.points, new Uint8Array(input.data.points.buffer));
            }

            if (meshJSON.numberOfPointPixels) {
              pipelineModule.writeFile(meshJSON.pointData, new Uint8Array(input.data.pointData.buffer));
            }

            if (meshJSON.numberOfCells) {
              pipelineModule.writeFile(meshJSON.cells, new Uint8Array(input.data.cells.buffer));
            }

            if (meshJSON.numberOfCellPixels) {
              pipelineModule.writeFile(meshJSON.cellData, new Uint8Array(input.data.cellData.buffer));
            }

            break;
          }

        default:
          throw Error('Unsupported input IOType');
      }
    });
  }

  pipelineModule.resetModuleStdout();
  pipelineModule.resetModuleStderr();
  pipelineModule.callMain(args);
  var stdout = pipelineModule.getModuleStdout();
  var stderr = pipelineModule.getModuleStderr();
  var populatedOutputs = [];

  if (outputs) {
    outputs.forEach(function (output) {
      var populatedOutput = {};
      Object.assign(populatedOutput, output);

      switch (output.type) {
        case IOTypes.Text:
          {
            populatedOutput.data = pipelineModule.readFile(output.path, {
              encoding: 'utf8'
            });
            break;
          }

        case IOTypes.Binary:
          {
            populatedOutput.data = pipelineModule.readFile(output.path, {
              encoding: 'binary'
            });
            break;
          }

        case IOTypes.Image:
          {
            var imageJSON = pipelineModule.readFile(output.path, {
              encoding: 'utf8'
            });
            var image = JSON.parse(imageJSON);
            var dataUint8 = pipelineModule.readFile(image.data, {
              encoding: 'binary'
            });
            image.data = bufferToTypedArray(image.imageType.componentType, dataUint8.buffer);
            populatedOutput.data = image;
            break;
          }

        case IOTypes.Mesh:
          {
            var meshJSON = pipelineModule.readFile(output.path, {
              encoding: 'utf8'
            });
            var mesh = JSON.parse(meshJSON);

            if (mesh.numberOfPoints) {
              var dataUint8Points = pipelineModule.readFile(mesh.points, {
                encoding: 'binary'
              });
              mesh.points = bufferToTypedArray(mesh.meshType.pointComponentType, dataUint8Points.buffer);
            } else {
              mesh.points = bufferToTypedArray(mesh.meshType.pointComponentType, new ArrayBuffer(0));
            }

            if (mesh.numberOfPointPixels) {
              var dataUint8PointData = pipelineModule.readFile(mesh.pointData, {
                encoding: 'binary'
              });
              mesh.pointData = bufferToTypedArray(mesh.meshType.pointPixelComponentType, dataUint8PointData.buffer);
            } else {
              mesh.pointData = bufferToTypedArray(mesh.meshType.pointPixelComponentType, new ArrayBuffer(0));
            }

            if (mesh.numberOfCells) {
              var dataUint8Cells = pipelineModule.readFile(mesh.cells, {
                encoding: 'binary'
              });
              mesh.cells = bufferToTypedArray(mesh.meshType.cellComponentType, dataUint8Cells.buffer);
            } else {
              mesh.cells = bufferToTypedArray(mesh.meshType.cellComponentType, new ArrayBuffer(0));
            }

            if (mesh.numberOfCellPixels) {
              var dataUint8CellData = pipelineModule.readFile(mesh.cellData, {
                encoding: 'binary'
              });
              mesh.cellData = bufferToTypedArray(mesh.meshType.cellPixelComponentType, dataUint8CellData.buffer);
            } else {
              mesh.cellData = bufferToTypedArray(mesh.meshType.cellPixelComponentType, new ArrayBuffer(0));
            }

            populatedOutput.data = mesh;
            break;
          }

        case IOTypes.vtkPolyData:
          {
            var polyDataJSON = pipelineModule.readFile("".concat(output.path, "/index.json"), {
              encoding: 'utf8'
            });
            var polyData = JSON.parse(polyDataJSON);
            var cellTypes = ['points', 'verts', 'lines', 'polys', 'strips'];
            cellTypes.forEach(function (cellName) {
              if (polyData[cellName]) {
                var cell = polyData[cellName];

                if (cell.ref) {
                  var _dataUint = pipelineModule.readFile("".concat(output.path, "/").concat(cell.ref.basepath, "/").concat(cell.ref.id), {
                    encoding: 'binary'
                  });

                  polyData[cellName].buffer = _dataUint.buffer;
                  polyData[cellName].values = typedArrayForBuffer(polyData[cellName].dataType, _dataUint.buffer);
                  delete cell.ref;
                }
              }
            });
            var dataSetType = ['pointData', 'cellData', 'fieldData'];
            dataSetType.forEach(function (dataName) {
              if (polyData[dataName]) {
                var data = polyData[dataName];
                data.arrays.forEach(function (array) {
                  if (array.data.ref) {
                    var _dataUint2 = pipelineModule.readFile("".concat(output.path, "/").concat(array.data.ref.basepath, "/").concat(array.data.ref.id), {
                      encoding: 'binary'
                    });

                    array.data.buffer = _dataUint2.buffer;
                    array.data.values = typedArrayForBuffer(array.data.dataType, _dataUint2.buffer);
                    delete array.data.ref;
                  }
                });
              }
            });
            populatedOutput.data = polyData;
            break;
          }

        default:
          throw Error('Unsupported output IOType');
      }

      populatedOutputs.push(populatedOutput);
    });
  }

  return {
    stdout: stdout,
    stderr: stderr,
    outputs: populatedOutputs
  };
};

module.exports = runPipelineEmscripten;