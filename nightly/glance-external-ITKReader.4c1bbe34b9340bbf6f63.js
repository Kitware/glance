(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return (window["webpackJsonp"] = window["webpackJsonp"] || []).push([["glance-external-ITKReader"],{

/***/ "./externals/ITKReader/ITKDicomImageReader.js":
/*!****************************************************!*\
  !*** ./externals/ITKReader/ITKDicomImageReader.js ***!
  \****************************************************/
/*! exports provided: extend, newInstance, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"extend\", function() { return extend; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"newInstance\", function() { return newInstance; });\n/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! regenerator-runtime */ \"./node_modules/regenerator-runtime/runtime.js\");\n/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var vtk_js_Sources_macro__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vtk.js/Sources/macro */ \"./node_modules/vtk.js/Sources/macro.js\");\n/* harmony import */ var vtk_js_Sources_Common_DataModel_ITKHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vtk.js/Sources/Common/DataModel/ITKHelper */ \"./node_modules/vtk.js/Sources/Common/DataModel/ITKHelper/index.js\");\n/* harmony import */ var itk_readImageDICOMFileSeries__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! itk/readImageDICOMFileSeries */ \"./node_modules/itk/readImageDICOMFileSeries.js\");\n/* eslint-disable-next-line no-unused-vars */\n\n\n\n\nvar convertItkToVtkImage = vtk_js_Sources_Common_DataModel_ITKHelper__WEBPACK_IMPORTED_MODULE_2__[\"default\"].convertItkToVtkImage;\n\nfunction getArrayName(filename) {\n  var idx = filename.lastIndexOf('.');\n  var name = idx > -1 ? filename.substring(0, idx) : filename;\n  return \"Scalars \".concat(name);\n} // ----------------------------------------------------------------------------\n// vtkITKDicomImageReader methods\n// ----------------------------------------------------------------------------\n\n\nfunction vtkITKDicomImageReader(publicAPI, model) {\n  // Set our className\n  model.classHierarchy.push('vtkITKDicomImageReader'); // Returns a promise to signal when image is ready\n\n  publicAPI.readFileSeries = function (files) {\n    if (!files || !files.length || files === model.files) {\n      return Promise.resolve();\n    }\n\n    model.files = files;\n    return Object(itk_readImageDICOMFileSeries__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(files).then(function (_ref) {\n      var image = _ref.image;\n      return image;\n    }).then(function (itkImage) {\n      var imageData = convertItkToVtkImage(itkImage, {\n        scalarArrayName: model.arrayName || getArrayName(model.fileName)\n      });\n      model.output[0] = imageData;\n      publicAPI.modified();\n    });\n  };\n\n  publicAPI.requestData = function ()\n  /* inData, outData */\n  {\n    publicAPI.readFileSeries(model.files, model.fileName);\n  };\n} // ----------------------------------------------------------------------------\n// Object factory\n// ----------------------------------------------------------------------------\n\n\nvar DEFAULT_VALUES = {\n  fileName: '',\n  // If null/undefined a unique array will be generated\n  arrayName: null\n}; // ----------------------------------------------------------------------------\n\nfunction extend(publicAPI, model) {\n  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};\n  Object.assign(model, DEFAULT_VALUES, initialValues); // Build VTK API\n\n  vtk_js_Sources_macro__WEBPACK_IMPORTED_MODULE_1__[\"default\"].obj(publicAPI, model);\n  vtk_js_Sources_macro__WEBPACK_IMPORTED_MODULE_1__[\"default\"].algo(publicAPI, model, 0, 1);\n  vtk_js_Sources_macro__WEBPACK_IMPORTED_MODULE_1__[\"default\"].setGet(publicAPI, model, ['fileName', 'arrayName']); // vtkITKDicomImageReader methods\n\n  vtkITKDicomImageReader(publicAPI, model);\n} // ----------------------------------------------------------------------------\n\nvar newInstance = vtk_js_Sources_macro__WEBPACK_IMPORTED_MODULE_1__[\"default\"].newInstance(extend, 'vtkITKDicomImageReader'); // ----------------------------------------------------------------------------\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  newInstance: newInstance,\n  extend: extend\n});\n\n//# sourceURL=webpack:///./externals/ITKReader/ITKDicomImageReader.js?");

/***/ }),

/***/ "./externals/ITKReader/index.js":
/*!**************************************!*\
  !*** ./externals/ITKReader/index.js ***!
  \**************************************/
/*! exports provided: imageExtensions, polyDataExtensions, extensions, registerToGlance, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"imageExtensions\", function() { return imageExtensions; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"polyDataExtensions\", function() { return polyDataExtensions; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"extensions\", function() { return extensions; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"registerToGlance\", function() { return registerToGlance; });\n/* harmony import */ var vtk_js_Sources_IO_Misc_ITKImageReader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vtk.js/Sources/IO/Misc/ITKImageReader */ \"./node_modules/vtk.js/Sources/IO/Misc/ITKImageReader/index.js\");\n/* harmony import */ var vtk_js_Sources_IO_Misc_ITKPolyDataReader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vtk.js/Sources/IO/Misc/ITKPolyDataReader */ \"./node_modules/vtk.js/Sources/IO/Misc/ITKPolyDataReader/index.js\");\n/* harmony import */ var itk_extensionToImageIO__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! itk/extensionToImageIO */ \"./node_modules/itk/extensionToImageIO.js\");\n/* harmony import */ var itk_extensionToImageIO__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(itk_extensionToImageIO__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var itk_readImageArrayBuffer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! itk/readImageArrayBuffer */ \"./node_modules/itk/readImageArrayBuffer.js\");\n/* harmony import */ var itk_extensionToPolyDataIO__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! itk/extensionToPolyDataIO */ \"./node_modules/itk/extensionToPolyDataIO.js\");\n/* harmony import */ var itk_extensionToPolyDataIO__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(itk_extensionToPolyDataIO__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var itk_readPolyDataArrayBuffer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! itk/readPolyDataArrayBuffer */ \"./node_modules/itk/readPolyDataArrayBuffer.js\");\n/* harmony import */ var _ITKDicomImageReader__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ITKDicomImageReader */ \"./externals/ITKReader/ITKDicomImageReader.js\");\n\n\n\n\n\n\n\nvtk_js_Sources_IO_Misc_ITKImageReader__WEBPACK_IMPORTED_MODULE_0__[\"default\"].setReadImageArrayBufferFromITK(itk_readImageArrayBuffer__WEBPACK_IMPORTED_MODULE_3__[\"default\"]);\nvtk_js_Sources_IO_Misc_ITKPolyDataReader__WEBPACK_IMPORTED_MODULE_1__[\"default\"].setReadPolyDataArrayBufferFromITK(itk_readPolyDataArrayBuffer__WEBPACK_IMPORTED_MODULE_5__[\"default\"]);\nvar imgExtSet = new Set(Array.from(itk_extensionToImageIO__WEBPACK_IMPORTED_MODULE_2___default.a.keys()).map(function (ext) {\n  return ext.toLowerCase();\n})); // blacklist json, since we load in measurements.json instead\n\nimgExtSet[\"delete\"]('json');\nvar imageExtensions = Array.from(imgExtSet);\nvar polyDataExtensions = Array.from(new Set(Array.from(itk_extensionToPolyDataIO__WEBPACK_IMPORTED_MODULE_4___default.a.keys()).map(function (ext) {\n  return ext.toLowerCase();\n})));\nvar extensions = imageExtensions.concat(polyDataExtensions);\nfunction registerToGlance(Glance) {\n  if (Glance) {\n    imageExtensions.filter(function (e) {\n      return e !== 'dcm';\n    }).forEach(function (extension) {\n      return Glance.registerReader({\n        extension: extension,\n        name: \"\".concat(extension.toUpperCase(), \" Reader\"),\n        vtkReader: vtk_js_Sources_IO_Misc_ITKImageReader__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n        binary: true,\n        fileNameMethod: 'setFileName'\n      });\n    });\n    polyDataExtensions.forEach(function (extension) {\n      return Glance.registerReader({\n        extension: extension,\n        name: \"\".concat(extension.toUpperCase(), \" Reader\"),\n        vtkReader: vtk_js_Sources_IO_Misc_ITKPolyDataReader__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n        binary: true,\n        fileNameMethod: 'setFileName'\n      });\n    });\n    Glance.registerReader({\n      extension: 'dcm',\n      name: 'DICOM File Series Reader',\n      vtkReader: _ITKDicomImageReader__WEBPACK_IMPORTED_MODULE_6__[\"default\"],\n      fileNameMethod: 'setFileName',\n      fileSeriesMethod: 'readFileSeries',\n      binary: true\n    });\n  }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  extensions: extensions,\n  registerToGlance: registerToGlance\n});\nvar Glance = (typeof window === 'undefined' ? {} : window).Glance;\nregisterToGlance(Glance);\n\n//# sourceURL=webpack:///./externals/ITKReader/index.js?");

/***/ }),

/***/ "./node_modules/webpack/hot sync ^\\.\\/log$":
/*!*************************************************!*\
  !*** (webpack)/hot sync nonrecursive ^\.\/log$ ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var map = {\n\t\"./log\": \"./node_modules/webpack/hot/log.js\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\treturn __webpack_require__(id);\n}\nfunction webpackContextResolve(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn map[req];\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./node_modules/webpack/hot sync ^\\\\.\\\\/log$\";\n\n//# sourceURL=webpack:///(webpack)/hot_sync_nonrecursive_^\\.\\/log$?");

/***/ }),

/***/ 1:
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///crypto_(ignored)?");

/***/ }),

/***/ 2:
/*!********************************************************************************************!*\
  !*** multi (webpack)-dev-server/client?http://0.0.0.0:9999 ./externals/ITKReader/index.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! /home/forrestli/Glance/node_modules/webpack-dev-server/client/index.js?http://0.0.0.0:9999 */\"./node_modules/webpack-dev-server/client/index.js?http://0.0.0.0:9999\");\nmodule.exports = __webpack_require__(/*! /home/forrestli/Glance/externals/ITKReader/index.js */\"./externals/ITKReader/index.js\");\n\n\n//# sourceURL=webpack:///multi_(webpack)-dev-server/client?");

/***/ })

},[[2,"runtime","vendors"]]]);
});