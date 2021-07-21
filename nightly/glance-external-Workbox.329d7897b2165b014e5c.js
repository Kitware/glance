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
return (window["webpackJsonp"] = window["webpackJsonp"] || []).push([["glance-external-Workbox"],{

/***/ "./externals/Workbox/index.js":
/*!************************************!*\
  !*** ./externals/Workbox/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("if ('serviceWorker' in navigator && document.location.protocol !== 'http:') {\n  window.addEventListener('load', function () {\n    navigator.serviceWorker.register('./serviceWorker.js').then(function (registration) {\n      console.log('Workbox service worker successful with scope:', registration.scope);\n    })[\"catch\"](function (error) {\n      console.error('Workbox service worker failed to register', error);\n    });\n  });\n}\n\n//# sourceURL=webpack:///./externals/Workbox/index.js?");

/***/ }),

/***/ "./node_modules/webpack/hot sync ^\\.\\/log$":
/*!*************************************************!*\
  !*** (webpack)/hot sync nonrecursive ^\.\/log$ ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var map = {\n\t\"./log\": \"./node_modules/webpack/hot/log.js\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\treturn __webpack_require__(id);\n}\nfunction webpackContextResolve(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn map[req];\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./node_modules/webpack/hot sync ^\\\\.\\\\/log$\";\n\n//# sourceURL=webpack:///(webpack)/hot_sync_nonrecursive_^\\.\\/log$?");

/***/ }),

/***/ 3:
/*!******************************************************************************************!*\
  !*** multi (webpack)-dev-server/client?http://0.0.0.0:9999 ./externals/Workbox/index.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! /home/forrestli/Glance/node_modules/webpack-dev-server/client/index.js?http://0.0.0.0:9999 */\"./node_modules/webpack-dev-server/client/index.js?http://0.0.0.0:9999\");\nmodule.exports = __webpack_require__(/*! /home/forrestli/Glance/externals/Workbox/index.js */\"./externals/Workbox/index.js\");\n\n\n//# sourceURL=webpack:///multi_(webpack)-dev-server/client?");

/***/ })

},[[3,"runtime","vendors"]]]);
});