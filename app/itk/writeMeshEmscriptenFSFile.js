var meshJSComponentToIOComponent = require('./meshJSComponentToIOComponent.js');

var meshJSPixelTypeToIOPixelType = require('./meshJSPixelTypeToIOPixelType.js');

var writeMeshEmscriptenFSFile = function writeMeshEmscriptenFSFile(module, _ref, mesh, filePath) {
  var useCompression = _ref.useCompression,
      binaryFileType = _ref.binaryFileType;
  var meshIO = new module.ITKMeshIO();
  meshIO.SetFileName(filePath);

  if (!meshIO.CanWriteFile(filePath)) {
    throw new Error('Could not write file: ' + filePath);
  }

  var dimension = mesh.meshType.dimension;
  meshIO.SetPointDimension(dimension);
  var pointIOComponentType = meshJSComponentToIOComponent(module, mesh.meshType.pointComponentType);
  meshIO.SetPointComponentType(pointIOComponentType);
  var cellIOComponentType = meshJSComponentToIOComponent(module, mesh.meshType.cellComponentType);
  meshIO.SetCellComponentType(cellIOComponentType);
  var pointPixelIOComponentType = meshJSComponentToIOComponent(module, mesh.meshType.pointPixelComponentType);
  meshIO.SetPointPixelComponentType(pointPixelIOComponentType);
  var pointIOPixelType = meshJSPixelTypeToIOPixelType(module, mesh.meshType.pointPixelType);
  meshIO.SetPointPixelType(pointIOPixelType);
  meshIO.SetNumberOfPointPixelComponents(mesh.meshType.pointPixelComponents);
  var cellPixelIOComponentType = meshJSComponentToIOComponent(module, mesh.meshType.cellPixelComponentType);
  meshIO.SetCellPixelComponentType(cellPixelIOComponentType);
  var cellIOPixelType = meshJSPixelTypeToIOPixelType(module, mesh.meshType.cellPixelType);
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
    var numberOfBytes = mesh.points.length * mesh.points.BYTES_PER_ELEMENT;

    var dataPtr = module._malloc(numberOfBytes);

    var dataHeap = new Uint8Array(module.HEAPU8.buffer, dataPtr, numberOfBytes);
    dataHeap.set(new Uint8Array(mesh.points.buffer));
    meshIO.WritePoints(dataHeap.byteOffset);

    module._free(dataHeap.byteOffset);
  }

  if (mesh.numberOfCells > 0) {
    var _numberOfBytes = mesh.cells.length * mesh.cells.BYTES_PER_ELEMENT;

    var _dataPtr = module._malloc(_numberOfBytes);

    var _dataHeap = new Uint8Array(module.HEAPU8.buffer, _dataPtr, _numberOfBytes);

    _dataHeap.set(new Uint8Array(mesh.cells.buffer));

    meshIO.WriteCells(_dataHeap.byteOffset);

    module._free(_dataHeap.byteOffset);
  }

  if (mesh.numberOfPointPixels > 0) {
    var _numberOfBytes2 = mesh.pointData.length * mesh.pointData.BYTES_PER_ELEMENT;

    var _dataPtr2 = module._malloc(_numberOfBytes2);

    var _dataHeap2 = new Uint8Array(module.HEAPU8.buffer, _dataPtr2, _numberOfBytes2);

    _dataHeap2.set(new Uint8Array(mesh.pointData.buffer));

    meshIO.WritePointData(_dataHeap2.byteOffset);

    module._free(_dataHeap2.byteOffset);
  }

  if (mesh.numberOfCellPixels > 0) {
    var _numberOfBytes3 = mesh.cellData.length * mesh.cellData.BYTES_PER_ELEMENT;

    var _dataPtr3 = module._malloc(_numberOfBytes3);

    var _dataHeap3 = new Uint8Array(module.HEAPU8.buffer, _dataPtr3, _numberOfBytes3);

    _dataHeap3.set(new Uint8Array(mesh.cellData.buffer));

    meshIO.WriteCellData(_dataHeap3.byteOffset);

    module._free(_dataHeap3.byteOffset);
  }

  meshIO.Write();
};

module.exports = writeMeshEmscriptenFSFile;