"use strict";

const Mesh = require('./Mesh.js');

const MeshType = require('./MeshType.js');

const meshIOComponentToJSComponent = require('./meshIOComponentToJSComponent.js');

const meshIOPixelTypeToJSPixelType = require('./meshIOPixelTypeToJSPixelType.js');

const readMeshEmscriptenFSFile = (module, filePath) => {
  const meshIO = new module.ITKMeshIO();
  meshIO.SetFileName(filePath);

  if (!meshIO.CanReadFile(filePath)) {
    throw new Error('Could not read file: ' + filePath);
  }

  meshIO.ReadMeshInformation();
  const ioDimensions = meshIO.GetPointDimension();
  const meshType = new MeshType(ioDimensions);
  const pointComponentType = meshIO.GetPointComponentType();
  meshType.pointComponentType = meshIOComponentToJSComponent(module, pointComponentType);
  const cellComponentType = meshIO.GetCellComponentType();
  meshType.cellComponentType = meshIOComponentToJSComponent(module, cellComponentType);
  const pointPixelComponentType = meshIO.GetPointPixelComponentType();
  meshType.pointPixelComponentType = meshIOComponentToJSComponent(module, pointPixelComponentType);
  const pointPixelType = meshIO.GetPointPixelType();
  meshType.pointPixelType = meshIOPixelTypeToJSPixelType(module, pointPixelType);
  meshType.pointPixelComponents = meshIO.GetNumberOfPointPixelComponents();
  const cellPixelComponentType = meshIO.GetCellPixelComponentType();
  meshType.cellPixelComponentType = meshIOComponentToJSComponent(module, cellPixelComponentType);
  const cellPixelType = meshIO.GetCellPixelType();
  meshType.cellPixelType = meshIOPixelTypeToJSPixelType(module, cellPixelType);
  meshType.cellPixelComponents = meshIO.GetNumberOfCellPixelComponents();
  const mesh = new Mesh(meshType);
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