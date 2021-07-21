"use strict";

const meshJSComponentToIOComponent = require('./meshJSComponentToIOComponent.js');

const meshJSPixelTypeToIOPixelType = require('./meshJSPixelTypeToIOPixelType.js');

const writeMeshEmscriptenFSFile = (module, {
  useCompression,
  binaryFileType
}, mesh, filePath) => {
  const meshIO = new module.ITKMeshIO();
  meshIO.SetFileName(filePath);

  if (!meshIO.CanWriteFile(filePath)) {
    throw new Error('Could not write file: ' + filePath);
  }

  const dimension = mesh.meshType.dimension;
  meshIO.SetPointDimension(dimension);
  const pointIOComponentType = meshJSComponentToIOComponent(module, mesh.meshType.pointComponentType);
  meshIO.SetPointComponentType(pointIOComponentType);
  const cellIOComponentType = meshJSComponentToIOComponent(module, mesh.meshType.cellComponentType);
  meshIO.SetCellComponentType(cellIOComponentType);
  const pointPixelIOComponentType = meshJSComponentToIOComponent(module, mesh.meshType.pointPixelComponentType);
  meshIO.SetPointPixelComponentType(pointPixelIOComponentType);
  const pointIOPixelType = meshJSPixelTypeToIOPixelType(module, mesh.meshType.pointPixelType);
  meshIO.SetPointPixelType(pointIOPixelType);
  meshIO.SetNumberOfPointPixelComponents(mesh.meshType.pointPixelComponents);
  const cellPixelIOComponentType = meshJSComponentToIOComponent(module, mesh.meshType.cellPixelComponentType);
  meshIO.SetCellPixelComponentType(cellPixelIOComponentType);
  const cellIOPixelType = meshJSPixelTypeToIOPixelType(module, mesh.meshType.cellPixelType);
  meshIO.SetCellPixelType(cellIOPixelType);
  meshIO.SetNumberOfCellPixelComponents(mesh.meshType.cellPixelComponents);
  meshIO.SetUseCompression(!!useCompression);

  if (binaryFileType) {
    meshIO.SetFileType(module.FileType.BINARY);
  } else {
    meshIO.SetFileType(module.FileType.ASCII);
  }

  meshIO.SetByteOrder(module.ByteOrder.LittleEndian);
  meshIO.SetNumberOfPoints(mesh.numberOfPoints);

  if (mesh.numberOfPoints > 0) {
    meshIO.SetUpdatePoints(true);
  }

  meshIO.SetNumberOfPointPixels(mesh.numberOfPointPixels);

  if (mesh.numberOfPointPixels > 0) {
    meshIO.SetUpdatePointData(true);
  }

  meshIO.SetNumberOfCells(mesh.numberOfCells);

  if (mesh.numberOfCells > 0) {
    meshIO.SetUpdateCells(true);
  }

  meshIO.SetNumberOfCellPixels(mesh.numberOfCellPixels);
  meshIO.SetCellBufferSize(mesh.cellBufferSize);

  if (mesh.numberOfCellPixels > 0) {
    meshIO.SetUpdatePointData(true);
  }

  meshIO.WriteMeshInformation();

  if (mesh.numberOfPoints > 0) {
    const numberOfBytes = mesh.points.length * mesh.points.BYTES_PER_ELEMENT;

    const dataPtr = module._malloc(numberOfBytes);

    const dataHeap = new Uint8Array(module.HEAPU8.buffer, dataPtr, numberOfBytes);
    dataHeap.set(new Uint8Array(mesh.points.buffer));
    meshIO.WritePoints(dataHeap.byteOffset);

    module._free(dataHeap.byteOffset);
  }

  if (mesh.numberOfCells > 0) {
    const numberOfBytes = mesh.cells.length * mesh.cells.BYTES_PER_ELEMENT;

    const dataPtr = module._malloc(numberOfBytes);

    const dataHeap = new Uint8Array(module.HEAPU8.buffer, dataPtr, numberOfBytes);
    dataHeap.set(new Uint8Array(mesh.cells.buffer));
    meshIO.WriteCells(dataHeap.byteOffset);

    module._free(dataHeap.byteOffset);
  }

  if (mesh.numberOfPointPixels > 0) {
    const numberOfBytes = mesh.pointData.length * mesh.pointData.BYTES_PER_ELEMENT;

    const dataPtr = module._malloc(numberOfBytes);

    const dataHeap = new Uint8Array(module.HEAPU8.buffer, dataPtr, numberOfBytes);
    dataHeap.set(new Uint8Array(mesh.pointData.buffer));
    meshIO.WritePointData(dataHeap.byteOffset);

    module._free(dataHeap.byteOffset);
  }

  if (mesh.numberOfCellPixels > 0) {
    const numberOfBytes = mesh.cellData.length * mesh.cellData.BYTES_PER_ELEMENT;

    const dataPtr = module._malloc(numberOfBytes);

    const dataHeap = new Uint8Array(module.HEAPU8.buffer, dataPtr, numberOfBytes);
    dataHeap.set(new Uint8Array(mesh.cellData.buffer));
    meshIO.WriteCellData(dataHeap.byteOffset);

    module._free(dataHeap.byteOffset);
  }

  meshIO.Write();
};

module.exports = writeMeshEmscriptenFSFile;