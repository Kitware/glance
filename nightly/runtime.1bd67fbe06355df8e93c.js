!function(){"use strict";var e,t,r,n={},o={};function i(e){var t=o[e];if(void 0!==t)return t.exports;var r=o[e]={id:e,loaded:!1,exports:{}};return n[e].call(r.exports,r,r.exports,i),r.loaded=!0,r.exports}i.m=n,i.amdD=function(){throw new Error("define cannot be used indirect")},i.amdO={},e=[],i.O=function(t,r,n,o){if(!r){var u=1/0;for(l=0;l<e.length;l++){r=e[l][0],n=e[l][1],o=e[l][2];for(var c=!0,f=0;f<r.length;f++)(!1&o||u>=o)&&Object.keys(i.O).every((function(e){return i.O[e](r[f])}))?r.splice(f--,1):(c=!1,o<u&&(u=o));if(c){e.splice(l--,1);var a=n();void 0!==a&&(t=a)}}return t}o=o||0;for(var l=e.length;l>0&&e[l-1][2]>o;l--)e[l]=e[l-1];e[l]=[r,n,o]},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,{a:t}),t},r=Object.getPrototypeOf?function(e){return Object.getPrototypeOf(e)}:function(e){return e.__proto__},i.t=function(e,n){if(1&n&&(e=this(e)),8&n)return e;if("object"==typeof e&&e){if(4&n&&e.__esModule)return e;if(16&n&&"function"==typeof e.then)return e}var o=Object.create(null);i.r(o);var u={};t=t||[null,r({}),r([]),r(r)];for(var c=2&n&&e;"object"==typeof c&&!~t.indexOf(c);c=r(c))Object.getOwnPropertyNames(c).forEach((function(t){u[t]=function(){return e[t]}}));return u.default=function(){return e},i.d(o,u),o},i.d=function(e,t){for(var r in t)i.o(t,r)&&!i.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.hmd=function(e){return(e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:function(){throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e},function(){var e;i.g.importScripts&&(e=i.g.location+"");var t=i.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),i.p=e}(),function(){var e={0:0};i.O.j=function(t){return 0===e[t]};var t=function(t,r){var n,o,u=r[0],c=r[1],f=r[2],a=0;if(u.some((function(t){return 0!==e[t]}))){for(n in c)i.o(c,n)&&(i.m[n]=c[n]);if(f)var l=f(i)}for(t&&t(r);a<u.length;a++)o=u[a],i.o(e,o)&&e[o]&&e[o][0](),e[u[a]]=0;return i.O(l)},r=self.webpackChunkGlance=self.webpackChunkGlance||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))}()}();