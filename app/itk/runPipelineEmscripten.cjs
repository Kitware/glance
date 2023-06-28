"use strict";

const IOTypes = require('./IOTypes.js');

const bufferToTypedArray = require('./bufferToTypedArray.js');

const typedArrayForBuffer = (typedArrayType, buffer) => {
  let TypedArrayFunction = null;

  if (typeof window !== 'undefined') {
    // browser
    TypedArrayFunction = window[typedArrayType];
  } else {
    // Node.js
    TypedArrayFunction = global[typedArrayType];
  }

  return new TypedArrayFunction(buffer);
};

const runPipelineEmscripten = (pipelineModule, args, outputs, inputs) => {
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
            const imageJSON = {};

            for (const key in input.data) {
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
            const meshJSON = {};

            for (const key in input.data) {
              if (Object.prototype.hasOwnProperty.call(input.data, key) && key !== 'points' && key !== 'pointData' && key !== 'cells' && key !== 'cellData') {
                meshJSON[key] = input.data[key];
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
  const stdout = pipelineModule.getModuleStdout();
  const stderr = pipelineModule.getModuleStderr();
  const populatedOutputs = [];

  if (outputs) {
    outputs.forEach(function (output) {
      const populatedOutput = {};
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
            const imageJSON = pipelineModule.readFile(output.path, {
              encoding: 'utf8'
            });
            const image = JSON.parse(imageJSON);
            const dataUint8 = pipelineModule.readFile(image.data, {
              encoding: 'binary'
            });
            image.data = bufferToTypedArray(image.imageType.componentType, dataUint8.buffer);
            populatedOutput.data = image;
            break;
          }

        case IOTypes.Mesh:
          {
            const meshJSON = pipelineModule.readFile(output.path, {
              encoding: 'utf8'
            });
            const mesh = JSON.parse(meshJSON);

            if (mesh.numberOfPoints) {
              const dataUint8Points = pipelineModule.readFile(mesh.points, {
                encoding: 'binary'
              });
              mesh.points = bufferToTypedArray(mesh.meshType.pointComponentType, dataUint8Points.buffer);
            } else {
              mesh.points = bufferToTypedArray(mesh.meshType.pointComponentType, new ArrayBuffer(0));
            }

            if (mesh.numberOfPointPixels) {
              const dataUint8PointData = pipelineModule.readFile(mesh.pointData, {
                encoding: 'binary'
              });
              mesh.pointData = bufferToTypedArray(mesh.meshType.pointPixelComponentType, dataUint8PointData.buffer);
            } else {
              mesh.pointData = bufferToTypedArray(mesh.meshType.pointPixelComponentType, new ArrayBuffer(0));
            }

            if (mesh.numberOfCells) {
              const dataUint8Cells = pipelineModule.readFile(mesh.cells, {
                encoding: 'binary'
              });
              mesh.cells = bufferToTypedArray(mesh.meshType.cellComponentType, dataUint8Cells.buffer);
            } else {
              mesh.cells = bufferToTypedArray(mesh.meshType.cellComponentType, new ArrayBuffer(0));
            }

            if (mesh.numberOfCellPixels) {
              const dataUint8CellData = pipelineModule.readFile(mesh.cellData, {
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
            const polyDataJSON = pipelineModule.readFile(`${output.path}/index.json`, {
              encoding: 'utf8'
            });
            const polyData = JSON.parse(polyDataJSON);
            const cellTypes = ['points', 'verts', 'lines', 'polys', 'strips'];
            cellTypes.forEach(cellName => {
              if (polyData[cellName]) {
                const cell = polyData[cellName];

                if (cell.ref) {
                  const dataUint8 = pipelineModule.readFile(`${output.path}/${cell.ref.basepath}/${cell.ref.id}`, {
                    encoding: 'binary'
                  });
                  polyData[cellName].buffer = dataUint8.buffer;
                  polyData[cellName].values = typedArrayForBuffer(polyData[cellName].dataType, dataUint8.buffer);
                  delete cell.ref;
                }
              }
            });
            const dataSetType = ['pointData', 'cellData', 'fieldData'];
            dataSetType.forEach(dataName => {
              if (polyData[dataName]) {
                const data = polyData[dataName];
                data.arrays.forEach(array => {
                  if (array.data.ref) {
                    const dataUint8 = pipelineModule.readFile(`${output.path}/${array.data.ref.basepath}/${array.data.ref.id}`, {
                      encoding: 'binary'
                    });
                    array.data.buffer = dataUint8.buffer;
                    array.data.values = typedArrayForBuffer(array.data.dataType, dataUint8.buffer);
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
    stdout,
    stderr,
    outputs: populatedOutputs
  };
};

module.exports = runPipelineEmscripten;