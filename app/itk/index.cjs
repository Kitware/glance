"use strict";

var _copyImage = _interopRequireDefault(require("./copyImage"));

var _extensionToImageIO = _interopRequireDefault(require("./extensionToImageIO"));

var _extensionToMeshIO = _interopRequireDefault(require("./extensionToMeshIO.js"));

var _FloatTypes = _interopRequireDefault(require("./FloatTypes.js"));

var _getFileExtension = _interopRequireDefault(require("./getFileExtension.js"));

var _getMatrixElement = _interopRequireDefault(require("./getMatrixElement.js"));

var _imageIOComponentToJSComponent = _interopRequireDefault(require("./imageIOComponentToJSComponent.js"));

var _ImageIOIndex = _interopRequireDefault(require("./ImageIOIndex.js"));

var _imageIOPixelTypeToJSPixelType = _interopRequireDefault(require("./imageIOPixelTypeToJSPixelType.js"));

var _Image = _interopRequireDefault(require("./Image.js"));

var _imageJSComponentToIOComponent = _interopRequireDefault(require("./imageJSComponentToIOComponent.js"));

var _imageJSPixelTypeToIOPixelType = _interopRequireDefault(require("./imageJSPixelTypeToIOPixelType.js"));

var _imageSharedBufferOrCopy = _interopRequireDefault(require("./imageSharedBufferOrCopy"));

var _ImageType = _interopRequireDefault(require("./ImageType.js"));

var _IntTypes = _interopRequireDefault(require("./IntTypes.js"));

var _IOTypes = _interopRequireDefault(require("./IOTypes.js"));

var _Matrix = _interopRequireDefault(require("./Matrix.js"));

var _meshIOComponentToJSComponent = _interopRequireDefault(require("./meshIOComponentToJSComponent.js"));

var _MeshIOIndex = _interopRequireDefault(require("./MeshIOIndex.js"));

var _meshIOPixelTypeToJSPixelType = _interopRequireDefault(require("./meshIOPixelTypeToJSPixelType.js"));

var _Mesh = _interopRequireDefault(require("./Mesh.js"));

var _meshJSComponentToIOComponent = _interopRequireDefault(require("./meshJSComponentToIOComponent.js"));

var _meshJSPixelTypeToIOPixelType = _interopRequireDefault(require("./meshJSPixelTypeToIOPixelType.js"));

var _MeshType = _interopRequireDefault(require("./MeshType.js"));

var _MimeToImageIO = _interopRequireDefault(require("./MimeToImageIO.js"));

var _MimeToMeshIO = _interopRequireDefault(require("./MimeToMeshIO.js"));

var _PixelTypes = _interopRequireDefault(require("./PixelTypes.js"));

var _readArrayBuffer = _interopRequireDefault(require("./readArrayBuffer.js"));

var _readBlob = _interopRequireDefault(require("./readBlob.js"));

var _readFile = _interopRequireDefault(require("./readFile.js"));

var _readImageArrayBuffer = _interopRequireDefault(require("./readImageArrayBuffer.js"));

var _readImageBlob = _interopRequireDefault(require("./readImageBlob.js"));

var _readImageDICOMFileSeries = _interopRequireDefault(require("./readImageDICOMFileSeries.js"));

var _readImageFile = _interopRequireDefault(require("./readImageFile.js"));

var _readImageHTTP = _interopRequireDefault(require("./readImageHTTP.js"));

var _readMeshArrayBuffer = _interopRequireDefault(require("./readMeshArrayBuffer.js"));

var _readMeshBlob = _interopRequireDefault(require("./readMeshBlob.js"));

var _readMeshFile = _interopRequireDefault(require("./readMeshFile.js"));

var _readPolyDataArrayBuffer = _interopRequireDefault(require("./readPolyDataArrayBuffer.js"));

var _readPolyDataBlob = _interopRequireDefault(require("./readPolyDataBlob.js"));

var _readPolyDataFile = _interopRequireDefault(require("./readPolyDataFile.js"));

var _runPipelineBrowser = _interopRequireDefault(require("./runPipelineBrowser.js"));

var _setMatrixElement = _interopRequireDefault(require("./setMatrixElement.js"));

var _stackImages = _interopRequireDefault(require("./stackImages.js"));

var _WorkerPool = _interopRequireDefault(require("./WorkerPool.js"));

var _writeArrayBuffer = _interopRequireDefault(require("./writeArrayBuffer.js"));

var _writeImageArrayBuffer = _interopRequireDefault(require("./writeImageArrayBuffer.js"));

var _writeMeshArrayBuffer = _interopRequireDefault(require("./writeMeshArrayBuffer.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const itk = {};
itk.copyImage = _copyImage.default;
itk.extensionToImageIO = _extensionToImageIO.default;
itk.extensionToMeshIO = _extensionToMeshIO.default;
itk.FloatTypes = _FloatTypes.default;
itk.getFileExtension = _getFileExtension.default;
itk.getMatrixElement = _getMatrixElement.default;
itk.imageIOComponentToJSComponent = _imageIOComponentToJSComponent.default;
itk.ImageIOIndex = _ImageIOIndex.default;
itk.imageIOPixelTypeToJSPixelType = _imageIOPixelTypeToJSPixelType.default;
itk.Image = _Image.default;
itk.imageJSComponentToIOComponent = _imageJSComponentToIOComponent.default;
itk.imageJSPixelTypeToIOPixelType = _imageJSPixelTypeToIOPixelType.default;
itk.imageSharedBufferOrCopy = _imageSharedBufferOrCopy.default;
itk.ImageType = _ImageType.default;
itk.IntTypes = _IntTypes.default;
itk.IOTypes = _IOTypes.default;
itk.Matrix = _Matrix.default;
itk.meshIOComponentToJSComponent = _meshIOComponentToJSComponent.default;
itk.MeshIOIndex = _MeshIOIndex.default;
itk.meshIOPixelTypeToJSPixelType = _meshIOPixelTypeToJSPixelType.default;
itk.Mesh = _Mesh.default;
itk.meshJSComponentToIOComponent = _meshJSComponentToIOComponent.default;
itk.meshJSPixelTypeToIOPixelType = _meshJSPixelTypeToIOPixelType.default;
itk.MeshType = _MeshType.default;
itk.MimeToImageIO = _MimeToImageIO.default;
itk.MimeToMeshIO = _MimeToMeshIO.default;
itk.PixelTypes = _PixelTypes.default;
itk.readArrayBuffer = _readArrayBuffer.default;
itk.readBlob = _readBlob.default;
itk.readFile = _readFile.default;
itk.readImageArrayBuffer = _readImageArrayBuffer.default;
itk.readImageBlob = _readImageBlob.default;
itk.readImageDICOMFileSeries = _readImageDICOMFileSeries.default;
itk.readImageFile = _readImageFile.default;
itk.readImageHTTP = _readImageHTTP.default;
itk.readMeshArrayBuffer = _readMeshArrayBuffer.default;
itk.readMeshBlob = _readMeshBlob.default;
itk.readMeshFile = _readMeshFile.default;
itk.readPolyDataArrayBuffer = _readPolyDataArrayBuffer.default;
itk.readPolyDataBlob = _readPolyDataBlob.default;
itk.readPolyDataFile = _readPolyDataFile.default;
itk.runPipelineBrowser = _runPipelineBrowser.default;
itk.setMatrixElement = _setMatrixElement.default;
itk.stackImages = _stackImages.default;
itk.WorkerPool = _WorkerPool.default;
itk.writeArrayBuffer = _writeArrayBuffer.default;
itk.writeImageArrayBuffer = _writeImageArrayBuffer.default;
itk.writeMeshArrayBuffer = _writeMeshArrayBuffer.default; // Expose itk to global scope without exporting it so nested namespace
// do not pollute the global one.

window.itk = itk;