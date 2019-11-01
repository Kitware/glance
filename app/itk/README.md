itk.js
======

[![Build Status](https://dev.azure.com/InsightSoftwareConsortium/ITKModules/_apis/build/status/InsightSoftwareConsortium.ITKMeshToPolyData?branchName=master)](https://dev.azure.com/InsightSoftwareConsortium/ITKModules/_build/latest?definitionId=11&branchName=master)
[![CircleCI](https://img.shields.io/circleci/project/github/InsightSoftwareConsortium/itk-js/master.svg)](https://circleci.com/gh/InsightSoftwareConsortium/itk-js)

*itk.js* combines [Emscripten](http://emscripten.org/) and
[ITK](https://www.itk.org/) to enable high-performance spatial analysis in a
JavaScript runtime environment.

The project provides tools to a) build C/C++ code to JavaScript
([asm.js](http://asmjs.org/)) and [WebAssembly](http://webassembly.org/), b)
bridge local filesystems, native JavaScript data structures, and traditional
file formats, c) transfer data efficiently in and out of the Emscripten
runtime, and d) asynchronously execute processing pipelines in a background
thread. *itk.js* can be used to execute [ITK](https://www.itk.org/),
[VTK](https://www.vtk.org/) or arbitrary C++ codes in the browser or on a
workstation / server with Node.js.

For more information, please see [the project
documentation](https://insightsoftwareconsortium.github.io/itk-js/).
