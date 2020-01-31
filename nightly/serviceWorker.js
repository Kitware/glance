importScripts('workbox-sw.prod.v2.1.2.js');

const workboxSW = new self.WorkboxSW({ clientsClaim: true });
workboxSW.precache([
  {
    "url": "glance-external-ITKReader.js",
    "revision": "2214778994714c87b43adeb30b9db7c8"
  },
  {
    "url": "glance-external-Workbox.js",
    "revision": "3da1de8f1db90213e42638ec944f1ec3"
  },
  {
    "url": "glance.css",
    "revision": "db05f81564de410f51ee0d6e8e21bae9"
  },
  {
    "url": "glance.js",
    "revision": "8cacc6abbe4ed6a7ad85d5dfa79b9528"
  },
  {
    "url": "global.css",
    "revision": "305f035e3feab812571a66912b405c78"
  },
  {
    "url": "index.html",
    "revision": "36e5343e1111aa303be739b2938e422e"
  },
  {
    "url": "itk/bufferToTypedArray.js",
    "revision": "fc3c0b40eb13b33f260a70baa3797763"
  },
  {
    "url": "itk/createWebworkerPromise.js",
    "revision": "a67988d2ac2f03d131f3b654f3caa233"
  },
  {
    "url": "itk/extensionToImageIO.js",
    "revision": "f440739a3533cbabbcedc3ffdfade7dc"
  },
  {
    "url": "itk/extensionToMeshIO.js",
    "revision": "6047791b09b38e5e2dfc3e976a8ffda1"
  },
  {
    "url": "itk/extensionToPolyDataIO.js",
    "revision": "805072ae47ac2e8307cf2b0f3a4610c1"
  },
  {
    "url": "itk/FloatTypes.js",
    "revision": "786c92c0279ce8eacd7cd96eba8a48f3"
  },
  {
    "url": "itk/getFileExtension.js",
    "revision": "04917c3ff34191f39354bb00332572ef"
  },
  {
    "url": "itk/getMatrixElement.js",
    "revision": "b5b833b11487416068b17f1395023a40"
  },
  {
    "url": "itk/Image.js",
    "revision": "088184a92ce08bbc0cb664cade150176"
  },
  {
    "url": "itk/imageIOComponentToJSComponent.js",
    "revision": "895102fb7c928d61e36e10d8d9391b11"
  },
  {
    "url": "itk/ImageIOIndex.js",
    "revision": "9b88a4190ddca44da03daa1474d1d3f6"
  },
  {
    "url": "itk/imageIOPixelTypeToJSPixelType.js",
    "revision": "5603b2b293f344b99ee6f1823ef13824"
  },
  {
    "url": "itk/ImageIOs/itkBioRadImageIOJSBinding.js",
    "revision": "08a86bf6528b44bc186d5d5e6f2e070a"
  },
  {
    "url": "itk/ImageIOs/itkBioRadImageIOJSBindingWasm.js",
    "revision": "9d4028dcd9f5e0ee0a68c4542c2ba80f"
  },
  {
    "url": "itk/ImageIOs/itkBMPImageIOJSBinding.js",
    "revision": "c884b9fa57229ffda15048f5ce404571"
  },
  {
    "url": "itk/ImageIOs/itkBMPImageIOJSBindingWasm.js",
    "revision": "cca02e401ae40fc51d2e3612b5e09507"
  },
  {
    "url": "itk/ImageIOs/itkGE4ImageIOJSBinding.js",
    "revision": "d34c5d14f90d59ce35e01b15bec00e6a"
  },
  {
    "url": "itk/ImageIOs/itkGE4ImageIOJSBindingWasm.js",
    "revision": "e79796109490ca2853f5bf7945eb7c2f"
  },
  {
    "url": "itk/ImageIOs/itkGE5ImageIOJSBinding.js",
    "revision": "7e17ff29caf2568e9e7434de748d6d3c"
  },
  {
    "url": "itk/ImageIOs/itkGE5ImageIOJSBindingWasm.js",
    "revision": "e34e90d5af8444821d625eab2511c804"
  },
  {
    "url": "itk/ImageIOs/itkGEAdwImageIOJSBinding.js",
    "revision": "4b3e57abf813258c6695adab1785c98d"
  },
  {
    "url": "itk/ImageIOs/itkGEAdwImageIOJSBindingWasm.js",
    "revision": "f0e91cb1111a0da0c5dca902158a5bc1"
  },
  {
    "url": "itk/ImageIOs/itkGiplImageIOJSBinding.js",
    "revision": "cb00efffc464179d58cb54fa944c77a2"
  },
  {
    "url": "itk/ImageIOs/itkGiplImageIOJSBindingWasm.js",
    "revision": "d8504c2e6eed0aec174c8763a6a9f863"
  },
  {
    "url": "itk/ImageIOs/itkJPEGImageIOJSBinding.js",
    "revision": "14e78759650533b7b90a3e7b4a6247d0"
  },
  {
    "url": "itk/ImageIOs/itkJPEGImageIOJSBindingWasm.js",
    "revision": "ca9140f95ca96f7af0e43398dbc514ec"
  },
  {
    "url": "itk/ImageIOs/itkJSONImageIOJSBinding.js",
    "revision": "3d2a09c8c563f011c71fb0dbbb621167"
  },
  {
    "url": "itk/ImageIOs/itkJSONImageIOJSBindingWasm.js",
    "revision": "e9aebd2b337a53fe98e4c6ce9c26e8d7"
  },
  {
    "url": "itk/ImageIOs/itkLSMImageIOJSBinding.js",
    "revision": "03a215566451a8724f29a6d93c0ca233"
  },
  {
    "url": "itk/ImageIOs/itkLSMImageIOJSBindingWasm.js",
    "revision": "6c3af3952ed9cf7682af3a4db4f05974"
  },
  {
    "url": "itk/ImageIOs/itkMetaImageIOJSBinding.js",
    "revision": "3fc64e79e338feedce52a8281c9921eb"
  },
  {
    "url": "itk/ImageIOs/itkMetaImageIOJSBindingWasm.js",
    "revision": "f5cbc26b45e014e9ae0e32de54162934"
  },
  {
    "url": "itk/ImageIOs/itkMGHImageIOJSBinding.js",
    "revision": "e9edba060217855505dfcc34703888be"
  },
  {
    "url": "itk/ImageIOs/itkMGHImageIOJSBindingWasm.js",
    "revision": "06e3e65e447c9224f0d798a6b830f94d"
  },
  {
    "url": "itk/ImageIOs/itkMRCImageIOJSBinding.js",
    "revision": "8ccba233bfbbd47a0649bfb7f1e3c27a"
  },
  {
    "url": "itk/ImageIOs/itkMRCImageIOJSBindingWasm.js",
    "revision": "35deb8cfab93924d88ac46164124258e"
  },
  {
    "url": "itk/ImageIOs/itkNiftiImageIOJSBinding.js",
    "revision": "60ce14967e0408016edce73bdb63035d"
  },
  {
    "url": "itk/ImageIOs/itkNiftiImageIOJSBindingWasm.js",
    "revision": "974a36dafd9fe9f814590e263552a305"
  },
  {
    "url": "itk/ImageIOs/itkNrrdImageIOJSBinding.js",
    "revision": "5204d6fc0b441007e769b5183123275c"
  },
  {
    "url": "itk/ImageIOs/itkNrrdImageIOJSBindingWasm.js",
    "revision": "09013706bbaef2c8ce0a9197543b94d4"
  },
  {
    "url": "itk/ImageIOs/itkPNGImageIOJSBinding.js",
    "revision": "ad8925902144af43031118c228a0353e"
  },
  {
    "url": "itk/ImageIOs/itkPNGImageIOJSBindingWasm.js",
    "revision": "900e6c8d86b618bab84ca12081c3639f"
  },
  {
    "url": "itk/ImageIOs/itkTIFFImageIOJSBinding.js",
    "revision": "39eee37bc68c20962688312551905cbe"
  },
  {
    "url": "itk/ImageIOs/itkTIFFImageIOJSBindingWasm.js",
    "revision": "41a9a6d1d4837cf499213de077478118"
  },
  {
    "url": "itk/ImageIOs/itkVTKImageIOJSBinding.js",
    "revision": "d7f2228e02a3bd7a42a439cdaea4312f"
  },
  {
    "url": "itk/ImageIOs/itkVTKImageIOJSBindingWasm.js",
    "revision": "814efad83a48b5fefca5033a93462d53"
  },
  {
    "url": "itk/imageJSComponentToIOComponent.js",
    "revision": "2088702a4cb9117c9116bef51376d658"
  },
  {
    "url": "itk/imageJSPixelTypeToIOPixelType.js",
    "revision": "31b0f68a30ede357ed4ea68fc3719601"
  },
  {
    "url": "itk/ImageType.js",
    "revision": "4d52f2d76a46b0adffd2b184b41028e3"
  },
  {
    "url": "itk/index.js",
    "revision": "e537b1cbea7ffacc9b39e25775376ede"
  },
  {
    "url": "itk/IntTypes.js",
    "revision": "32a87875e1d723c67e39b439d662af79"
  },
  {
    "url": "itk/IOTypes.js",
    "revision": "274a7502c8f12328d3746e0492504140"
  },
  {
    "url": "itk/itk-js-cli.js",
    "revision": "5726292c364b1b7748e19d62748ef89e"
  },
  {
    "url": "itk/itkConfig.js",
    "revision": "a9da642a4fc895b80a933bea1de52377"
  },
  {
    "url": "itk/itkConfigCDN.js",
    "revision": "0d81309dd9518d64c9006374a77e946c"
  },
  {
    "url": "itk/loadEmscriptenModuleBrowser.js",
    "revision": "37a42ac1d5fa96c8655c7d359b79788f"
  },
  {
    "url": "itk/loadEmscriptenModuleNode.js",
    "revision": "760e452c7ac2ce003e3ffece1c88aa84"
  },
  {
    "url": "itk/Matrix.js",
    "revision": "696e1fd396a08372c12853fe14520607"
  },
  {
    "url": "itk/Mesh.js",
    "revision": "39ee277da2b2eaa8c94f989aa4cd4a6e"
  },
  {
    "url": "itk/meshIOComponentToJSComponent.js",
    "revision": "90de7c32cf5cd3d60126c6f919b68787"
  },
  {
    "url": "itk/MeshIOIndex.js",
    "revision": "663e93bd8be843afff0354112e3287e8"
  },
  {
    "url": "itk/meshIOPixelTypeToJSPixelType.js",
    "revision": "ec7177162b0dc19137f59b9f583e6add"
  },
  {
    "url": "itk/MeshIOs/itkBYUMeshIOJSBinding.js",
    "revision": "4d62b29f53ff24237a456ffbb312ca32"
  },
  {
    "url": "itk/MeshIOs/itkBYUMeshIOJSBindingWasm.js",
    "revision": "085a3b7287cd9119c7d5dcc0b8f0eb2b"
  },
  {
    "url": "itk/MeshIOs/itkFreeSurferAsciiMeshIOJSBinding.js",
    "revision": "a0bf44be6c2ee5293272ceb608eaed73"
  },
  {
    "url": "itk/MeshIOs/itkFreeSurferAsciiMeshIOJSBindingWasm.js",
    "revision": "54e2ee75bcaf4618bb22131bf1b13eb5"
  },
  {
    "url": "itk/MeshIOs/itkFreeSurferBinaryMeshIOJSBinding.js",
    "revision": "1bb68fc99daff88cff85efc5607f471f"
  },
  {
    "url": "itk/MeshIOs/itkFreeSurferBinaryMeshIOJSBindingWasm.js",
    "revision": "cd48340e739b95257356475e79c633fc"
  },
  {
    "url": "itk/MeshIOs/itkOBJMeshIOJSBinding.js",
    "revision": "2c2a76c39577722c8b35871c9b572353"
  },
  {
    "url": "itk/MeshIOs/itkOBJMeshIOJSBindingWasm.js",
    "revision": "eb59f63b2a0759c28f9f1d166d081cd1"
  },
  {
    "url": "itk/MeshIOs/itkOFFMeshIOJSBinding.js",
    "revision": "8d96c1b6fd777ab7800ea273e355f264"
  },
  {
    "url": "itk/MeshIOs/itkOFFMeshIOJSBindingWasm.js",
    "revision": "23059dfe924cf97113273b3d1f6492d5"
  },
  {
    "url": "itk/MeshIOs/itkSTLMeshIOJSBinding.js",
    "revision": "22a923e22c1f53fe31eb06ea06bcad6b"
  },
  {
    "url": "itk/MeshIOs/itkSTLMeshIOJSBindingWasm.js",
    "revision": "8b287aab101e7e564c27f90917394764"
  },
  {
    "url": "itk/MeshIOs/itkVTKPolyDataMeshIOJSBinding.js",
    "revision": "66aa475542fca7ee6cc6fa3971a7aae2"
  },
  {
    "url": "itk/MeshIOs/itkVTKPolyDataMeshIOJSBindingWasm.js",
    "revision": "ed3468060de0d7a9521c25df7e0bf5c9"
  },
  {
    "url": "itk/meshJSComponentToIOComponent.js",
    "revision": "2b27cef5a7d43957a28f4da96626fd14"
  },
  {
    "url": "itk/meshJSPixelTypeToIOPixelType.js",
    "revision": "05f00c2dd4bc66db539e4f414de6a2b1"
  },
  {
    "url": "itk/MeshType.js",
    "revision": "f2ec2302c5f1bf554ca8d3cac9e19c05"
  },
  {
    "url": "itk/MimeToImageIO.js",
    "revision": "5d0f3aff9d973cc281c7be2075c7e72a"
  },
  {
    "url": "itk/MimeToMeshIO.js",
    "revision": "aba361459fce0489e3be3cc8b0b58e23"
  },
  {
    "url": "itk/MimeToPolyDataIO.js",
    "revision": "aba361459fce0489e3be3cc8b0b58e23"
  },
  {
    "url": "itk/node_modules/commander/index.js",
    "revision": "5d56ccd99113d3a04f449b728b07c4c4"
  },
  {
    "url": "itk/node_modules/webworker-promise/coverage/lcov-report/base.css",
    "revision": "8eff00e811a7b84143fcd962eb512d87"
  },
  {
    "url": "itk/node_modules/webworker-promise/coverage/lcov-report/index.html",
    "revision": "c905c929b4c36cdbb6bdabe6c194fd67"
  },
  {
    "url": "itk/node_modules/webworker-promise/coverage/lcov-report/prettify.css",
    "revision": "31f0c9da5ac09f2563cab46ebc6e445a"
  },
  {
    "url": "itk/node_modules/webworker-promise/coverage/lcov-report/prettify.js",
    "revision": "fdaf2510a4125a409882ed554f89c039"
  },
  {
    "url": "itk/node_modules/webworker-promise/coverage/lcov-report/sorter.js",
    "revision": "2451f54f011e7d0295be5a4c6fd597f5"
  },
  {
    "url": "itk/node_modules/webworker-promise/coverage/lcov-report/src/index.html",
    "revision": "42fe86298616a2b2bddc3622581b1231"
  },
  {
    "url": "itk/node_modules/webworker-promise/coverage/lcov-report/src/index.js.html",
    "revision": "34cc8317753a824f370f368acbf93531"
  },
  {
    "url": "itk/node_modules/webworker-promise/coverage/lcov-report/src/node-worker.js.html",
    "revision": "2a68ab5bd90052728582d7c19b767719"
  },
  {
    "url": "itk/node_modules/webworker-promise/coverage/lcov-report/src/pool.js.html",
    "revision": "b20dd6b1c844a1319082cef1db53ee0a"
  },
  {
    "url": "itk/node_modules/webworker-promise/coverage/lcov-report/src/tiny-emitter.js.html",
    "revision": "c8171a85905910142f5ba728afdf4836"
  },
  {
    "url": "itk/node_modules/webworker-promise/dist/pool.js",
    "revision": "0b780d951352a3a069b137d85b8ea5bc"
  },
  {
    "url": "itk/node_modules/webworker-promise/dist/pool.min.js",
    "revision": "b0a06059e37bf121cd154c887f5664b1"
  },
  {
    "url": "itk/node_modules/webworker-promise/dist/register.js",
    "revision": "e0369f22b3d8e26960ff0186a72b9687"
  },
  {
    "url": "itk/node_modules/webworker-promise/dist/register.min.js",
    "revision": "0f6a2c1b92d6cc3a1755dd6062061137"
  },
  {
    "url": "itk/node_modules/webworker-promise/dist/worker.js",
    "revision": "f1127a8978b7b1d6749699dcba56c142"
  },
  {
    "url": "itk/node_modules/webworker-promise/dist/worker.min.js",
    "revision": "be108aafc78d8367fedb817a5b80a66a"
  },
  {
    "url": "itk/node_modules/webworker-promise/lib/index.js",
    "revision": "c3a694f8bf6d1b00edf7b02986a43292"
  },
  {
    "url": "itk/node_modules/webworker-promise/lib/node-child-proccess.js",
    "revision": "6559dfb214bac5e3c37bd8ca1dec6e37"
  },
  {
    "url": "itk/node_modules/webworker-promise/lib/node-child-process.js",
    "revision": "6559dfb214bac5e3c37bd8ca1dec6e37"
  },
  {
    "url": "itk/node_modules/webworker-promise/lib/node-worker.js",
    "revision": "5a2a024c5bd2cb1bbb3c0e36aa5ad3a3"
  },
  {
    "url": "itk/node_modules/webworker-promise/lib/node.js",
    "revision": "5a2a024c5bd2cb1bbb3c0e36aa5ad3a3"
  },
  {
    "url": "itk/node_modules/webworker-promise/lib/pool.js",
    "revision": "ea746fabd53aae343ad305858d674b6e"
  },
  {
    "url": "itk/node_modules/webworker-promise/lib/register.js",
    "revision": "4084eb97498b708c72fac0e87439e6f5"
  },
  {
    "url": "itk/node_modules/webworker-promise/lib/tiny-emitter.js",
    "revision": "514e487e38e7a1ba725c463671c388c2"
  },
  {
    "url": "itk/node_modules/webworker-promise/lib/worker-pool.js",
    "revision": "c2e44d933620fab65532bf4b5e87c574"
  },
  {
    "url": "itk/node_modules/webworker-promise/src/index.js",
    "revision": "12d39ad771a2364143806cab56ef6ab1"
  },
  {
    "url": "itk/node_modules/webworker-promise/src/node-child-process.js",
    "revision": "f2d9571a8967108b872d8557a900c409"
  },
  {
    "url": "itk/node_modules/webworker-promise/src/node-worker.js",
    "revision": "04203d1529440aaaf8ae250e43aa5d3c"
  },
  {
    "url": "itk/node_modules/webworker-promise/src/pool.js",
    "revision": "9589e86a28196dc459ac55c9f19ecfcf"
  },
  {
    "url": "itk/node_modules/webworker-promise/src/register.js",
    "revision": "0c82b4426ef61c7a80b7fd291bc37ac0"
  },
  {
    "url": "itk/node_modules/webworker-promise/src/tiny-emitter.js",
    "revision": "fa21cca3b340222647e905026aaf5a4d"
  },
  {
    "url": "itk/node_modules/webworker-promise/test/index.test.js",
    "revision": "e18e6eb3b097b8a95a0fc0baef76105d"
  },
  {
    "url": "itk/node_modules/webworker-promise/test/math.worker.js",
    "revision": "2227a080f4006769160d0003eba2ec18"
  },
  {
    "url": "itk/node_modules/webworker-promise/test/payload-type.worker.js",
    "revision": "56a39523acbd0883ea49036a75652edb"
  },
  {
    "url": "itk/node_modules/webworker-promise/test/tiny-emitter.test.js",
    "revision": "61ad6aff62dcb5810b53617116a152c3"
  },
  {
    "url": "itk/node_modules/webworker-promise/webpack.config.js",
    "revision": "f9eeedb3c62286b36caa9b17ffe902f0"
  },
  {
    "url": "itk/Pipelines/InputOutputFilesTest.js",
    "revision": "dce2afa2d68a74d87631178e04396227"
  },
  {
    "url": "itk/Pipelines/InputOutputFilesTestWasm.js",
    "revision": "3e723884b427c09972b646f74e249509"
  },
  {
    "url": "itk/Pipelines/itkfiltering.js",
    "revision": "11896aabfc8077cf2e283f7796b696f4"
  },
  {
    "url": "itk/Pipelines/itkfilteringWasm.js",
    "revision": "e79e4321ac90fe2a3f80b0e254745855"
  },
  {
    "url": "itk/Pipelines/itkJSPipelinePreInputOutputFilesTest.js",
    "revision": "d35d9824d3aeb0b65600992477a0cb87"
  },
  {
    "url": "itk/Pipelines/itkJSPipelinePreitkTestDriver.js",
    "revision": "97ad794cc81234a93207bd6fcc28c1af"
  },
  {
    "url": "itk/Pipelines/itkJSPipelinePreMedianFilterTest.js",
    "revision": "4c2ba0de21a7715cdd98601eeb1d4e12"
  },
  {
    "url": "itk/Pipelines/itkJSPipelinePreMeshReadWriteTest.js",
    "revision": "ee08debcbfae65ba718d6b18b58acc02"
  },
  {
    "url": "itk/Pipelines/itkJSPipelinePreMeshToPolyData.js",
    "revision": "95c6b476a4a69b082763fb0387c18316"
  },
  {
    "url": "itk/Pipelines/itkJSPipelinePreStdoutStderrTest.js",
    "revision": "44eb38006d03b8b9a6dc65dde10c5fb5"
  },
  {
    "url": "itk/Pipelines/itkJSPipelinePreWriteVTKPolyDataTest.js",
    "revision": "cb7406eb4b1443aa7c09fb2096527484"
  },
  {
    "url": "itk/Pipelines/MedianFilterTest.js",
    "revision": "6a8acdad0a7ee5a96c4a9f1be2709934"
  },
  {
    "url": "itk/Pipelines/MedianFilterTestWasm.js",
    "revision": "232b9593ce9e124c3e8401aaab6e6592"
  },
  {
    "url": "itk/Pipelines/MeshReadWriteTest.js",
    "revision": "ff36c95ab13f23f127099b6192370909"
  },
  {
    "url": "itk/Pipelines/MeshReadWriteTestWasm.js",
    "revision": "cebb815897d264bf1b11fcb68a6f7383"
  },
  {
    "url": "itk/Pipelines/StdoutStderrTest.js",
    "revision": "cf3a6829537adec37a94632f5a50a40f"
  },
  {
    "url": "itk/Pipelines/StdoutStderrTestWasm.js",
    "revision": "86322f6fb1a26bcd03915cf52a374650"
  },
  {
    "url": "itk/PixelTypes.js",
    "revision": "4fa031705ef3b81acc4a2717e0fd2049"
  },
  {
    "url": "itk/PolyDataIOIndex.js",
    "revision": "9c4ff3746125324d240de953be9d145d"
  },
  {
    "url": "itk/readArrayBuffer.js",
    "revision": "0530891e14d65137486a268d3284599f"
  },
  {
    "url": "itk/readBlob.js",
    "revision": "502ed8d9ad7ed6f160f00c51002e7547"
  },
  {
    "url": "itk/readFile.js",
    "revision": "c1d01e5e7304e11a13738467c4e90edc"
  },
  {
    "url": "itk/readImageArrayBuffer.js",
    "revision": "a259a00465ba77dab3ab7af895c1963b"
  },
  {
    "url": "itk/readImageBlob.js",
    "revision": "37c28c5ca49b26a58a643701d05b3615"
  },
  {
    "url": "itk/readImageDICOMFileSeries.js",
    "revision": "bb49f706c036b39ff921d01e7b32ce2e"
  },
  {
    "url": "itk/readImageEmscriptenFSDICOMFileSeries.js",
    "revision": "4e27bb06f7ce31a395f5a177ad3a877c"
  },
  {
    "url": "itk/readImageEmscriptenFSFile.js",
    "revision": "af156f2a9582ff368432b666dfab35a5"
  },
  {
    "url": "itk/readImageFile.js",
    "revision": "b803f4edfaefe1f17337546cb426b7b6"
  },
  {
    "url": "itk/readImageHTTP.js",
    "revision": "b0d0d8b8838b9545dcb3273046bba761"
  },
  {
    "url": "itk/readImageLocalDICOMFileSeries.js",
    "revision": "d639f0199ff767fde6e9120a5afff77d"
  },
  {
    "url": "itk/readImageLocalDICOMFileSeriesSync.js",
    "revision": "8f34212281ffb65a32c5356649e8d768"
  },
  {
    "url": "itk/readImageLocalFile.js",
    "revision": "737d2cb279cddbd825f37d09847700d5"
  },
  {
    "url": "itk/readImageLocalFileSync.js",
    "revision": "109df853264bcf775af5dd0b3b55f61e"
  },
  {
    "url": "itk/readLocalFile.js",
    "revision": "8fb0efca265914d2852880cdea0c9df8"
  },
  {
    "url": "itk/readLocalFileSync.js",
    "revision": "bbb6d14f78b3741b252cd577591200e7"
  },
  {
    "url": "itk/readMeshArrayBuffer.js",
    "revision": "3ac0c0d4ad2b914277576007a7f0a9d6"
  },
  {
    "url": "itk/readMeshBlob.js",
    "revision": "761e3e9e45b214e01df98f1f9c14f6ad"
  },
  {
    "url": "itk/readMeshEmscriptenFSFile.js",
    "revision": "25dc1fdbab7b50e8e47222cd8f80458f"
  },
  {
    "url": "itk/readMeshFile.js",
    "revision": "4846a9eda71178535634b335617e29c5"
  },
  {
    "url": "itk/readMeshLocalFile.js",
    "revision": "a257c746adfc7f224dd00585882d4d57"
  },
  {
    "url": "itk/readMeshLocalFileSync.js",
    "revision": "93367c12748c47e1b1f420285feec59e"
  },
  {
    "url": "itk/readPolyDataArrayBuffer.js",
    "revision": "d88e0957d8f33309716253d6af3bf556"
  },
  {
    "url": "itk/readPolyDataBlob.js",
    "revision": "2a096b23b04fa14a7eb834905ced2d0a"
  },
  {
    "url": "itk/readPolyDataFile.js",
    "revision": "0d9f37d5e9e05d710f6b95ddf87eed25"
  },
  {
    "url": "itk/readPolyDataLocalFile.js",
    "revision": "72d197d73334673dae99747216b6f052"
  },
  {
    "url": "itk/readPolyDataLocalFileSync.js",
    "revision": "8a9c327159998fe88c4792c6f633a387"
  },
  {
    "url": "itk/runPipelineBrowser.js",
    "revision": "8a490782922e76f5b0feeac151ebf9b7"
  },
  {
    "url": "itk/runPipelineEmscripten.js",
    "revision": "c30a34b171f655d6b89dd74a1f553ef8"
  },
  {
    "url": "itk/runPipelineNode.js",
    "revision": "bad2e6fb64ae0258958b5da17d166789"
  },
  {
    "url": "itk/runPipelineNodeSync.js",
    "revision": "5361e5412d619c76d357a7568e51d6b8"
  },
  {
    "url": "itk/setMatrixElement.js",
    "revision": "a0099a7c2321a96954e51816e53c6074"
  },
  {
    "url": "itk/umd/index.html",
    "revision": "760b6d2e85900ffc70fff6cdb5f721a9"
  },
  {
    "url": "itk/umd/itk.js",
    "revision": "bd2f43bfa7a96bc09fc2deecb6abf0d8"
  },
  {
    "url": "itk/WebWorkers/ImageIO.worker.js",
    "revision": "2e12a077f5d4eea5494e9f3a21f82893"
  },
  {
    "url": "itk/WebWorkers/MeshIO.worker.js",
    "revision": "a4db4a2a10f4ac177402fe2127b56d06"
  },
  {
    "url": "itk/WebWorkers/Pipeline.worker.js",
    "revision": "cd75aea3956a147e9e8beb9a5cc95208"
  },
  {
    "url": "itk/writeArrayBuffer.js",
    "revision": "aabb35e1df392af9a59cac330a566800"
  },
  {
    "url": "itk/writeImageArrayBuffer.js",
    "revision": "a6bccc57b7bb0453900b445c52c3b894"
  },
  {
    "url": "itk/writeImageEmscriptenFSFile.js",
    "revision": "6b45773bc0eccf6dd0ef17773a7dbc46"
  },
  {
    "url": "itk/writeImageLocalFile.js",
    "revision": "4e0622719fdc7a2e51dea811a1aa401a"
  },
  {
    "url": "itk/writeImageLocalFileSync.js",
    "revision": "38932fa7a9d4746850294a61ad1b7a80"
  },
  {
    "url": "itk/writeLocalFile.js",
    "revision": "f9d99f8f674622d089cbecabd848669b"
  },
  {
    "url": "itk/writeLocalFileSync.js",
    "revision": "811f2e370fac4bf4ce9dd05180903807"
  },
  {
    "url": "itk/writeMeshArrayBuffer.js",
    "revision": "4766a1caa590a090ea1078c9a9fb2cc5"
  },
  {
    "url": "itk/writeMeshEmscriptenFSFile.js",
    "revision": "ec1057f541c847b05666501a649c9327"
  },
  {
    "url": "itk/writeMeshLocalFile.js",
    "revision": "0797ad346c4a1b0e6655b79c78813313"
  },
  {
    "url": "itk/writeMeshLocalFileSync.js",
    "revision": "23fb1410a127c4861127777e7d39ab87"
  },
  {
    "url": "runtime.js",
    "revision": "3e509b6fbb60e3bacdc070373e53e258"
  },
  {
    "url": "vendors.css",
    "revision": "3c3ed88cf192219685f91853c4d6ef37"
  },
  {
    "url": "vendors.js",
    "revision": "d0e77ea228c9e116c4e039a7d9ccc04d"
  },
  {
    "url": "version.js",
    "revision": "18178c28bdc43998fd1c6b8c500eb91b"
  },
  {
    "url": "workbox-sw.prod.v2.1.2.js",
    "revision": "685d1ceb6b9a9f94aacf71d6aeef8b51"
  }
]);

workboxSW.router.registerRoute(
  /\.js|\.png|\.wasm$/,
  workboxSW.strategies.networkFirst({
    cacheName: 'networkFirstContent',
    cacheExpiration: {
      maxEntries: 50,
      maxAgeSeconds: 7 * 24 * 60 * 60 * 26,
    },
  })
);
