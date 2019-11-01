var Mesh = require('./Mesh.js');

var MeshType = require('./MeshType.js');

var meshIOComponentToJSComponent = require('./meshIOComponentToJSComponent.js');

var meshIOPixelTypeToJSPixelType = require('./meshIOPixelTypeToJSPixelType.js');

var readMeshEmscriptenFSFile = function readMeshEmscriptenFSFile(module, filePath) {
  var meshIO = new module.ITKMeshIO();
  meshIO.SetFileName(filePath);

  if (!meshIO.CanReadFile(filePath)) {
    throw new Error('Could not read file: ' + filePath);
  }

  meshIO.ReadMeshInformation();
  var ioDimensions = meshIO.GetPointDimension();
  var meshType = new MeshType(ioDimensions);
  var pointComponentType = meshIO.GetPointComponentType();
  meshType.pointComponentType = meshIOComponentToJSComponent(module, pointComponentType);
  var cellComponentType = meshIO.GetCellComponentType();
  meshType.cellComponentType = meshIOComponentToJSComponent(module, cellComponentType);
  var pointPixelComponentType = meshIO.GetPointPixelComponentType();
  meshType.pointPixelComponentType = meshIOComponentToJSComponent(module, pointPixelComponentType);
  var pointPixelType = meshIO.GetPointPixelType();
  meshType.pointPixelType = meshIOPixelTypeToJSPixelType(module, pointPixelType);
  meshType.pointPixelComponents = meshIO.GetNumberOfPointPixelComponents();
  var cellPixelComponentType = meshIO.GetCellPixelComponentType();
  meshType.cellPixelComponentType = meshIOComponentToJSComponent(module, cellPixelComponentType);
  var cellPixelType = meshIO.GetCellPixelType();
  meshType.cellPixelType = meshIOPixelTypeToJSPixelType(module, cellPixelType);
  meshType.cellPixelComponents = meshIO.GetNumberOfCellPixelComponents();
  var mesh = new Mesh(meshType);
  mesh.numberOfPoints = meshIO.GetNumberOfPoints();

  if (mesh.numberOfPoints > 0) {
    mesh.points = meshIO.ReadPoints();
  }

  mesh.numberOfCells = meshIO.GetNumberOfCells();

  if (mesh.numberOfCells > 0) {
    mesh.cellBufferSize = meshIO.GetCellBufferSize();
    mesh.cells = meshIO.ReadCells();
  }

  mesh.numberofPointPixels = meshIO.GetNumberOfPointPixels();

  if (mesh.numberOfPointPixels > 0) {
    mesh.pointData = meshIO.ReadPointData();
  }

  mesh.numberofCellPixels = meshIO.GetNumberOfCellPixels();

  if (mesh.numberOfCellPixels > 0) {
    mesh.cellData = meshIO.ReadCellData();
  }

  return mesh;
};

module.exports = readMeshEmscriptenFSFile;