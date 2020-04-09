importScripts('workbox-sw.prod.v2.1.2.js');

const workboxSW = new self.WorkboxSW({ clientsClaim: true });
workboxSW.precache([
  {
    "url": "glance-external-ITKReader.js",
    "revision": "105f1d96e7a2044c854d230523f1ca53"
  },
  {
    "url": "glance-external-Workbox.js",
    "revision": "95dfde404ecc7899d21299511b638656"
  },
  {
    "url": "glance.css",
    "revision": "ea93be29e46c4cbbe1a8e81a46f53471"
  },
  {
    "url": "glance.js",
    "revision": "db13e1f87a1076a677f8c45469a36266"
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
    "revision": "e83017323658f4cf57ec336c62ad240e"
  },
  {
    "url": "itk/ImageIOs/itkBioRadImageIOJSBindingWasm.js",
    "revision": "10e015e81b2331ab9e46fdafbaf5dc2a"
  },
  {
    "url": "itk/ImageIOs/itkBMPImageIOJSBinding.js",
    "revision": "969008a7c2b3119295047cda9ea87357"
  },
  {
    "url": "itk/ImageIOs/itkBMPImageIOJSBindingWasm.js",
    "revision": "a18cdbc6b813f7f8df1f2aa011a9ae61"
  },
  {
    "url": "itk/ImageIOs/itkDCMTKImageIOJSBindingWasm.js",
    "revision": "510093cda589e01edad65e8be1fc4b1f"
  },
  {
    "url": "itk/ImageIOs/itkDICOMImageSeriesReaderJSBindingWasm.js",
    "revision": "098f1f0d780dae6bb2ecf3c664327c9b"
  },
  {
    "url": "itk/ImageIOs/itkGDCMImageIOJSBindingWasm.js",
    "revision": "9ea638088d63349260e341bd413b08a8"
  },
  {
    "url": "itk/ImageIOs/itkGE4ImageIOJSBinding.js",
    "revision": "d18355f20a749b252aa75ff96b396e77"
  },
  {
    "url": "itk/ImageIOs/itkGE4ImageIOJSBindingWasm.js",
    "revision": "85ca65761f222382464ebefd1eb1c297"
  },
  {
    "url": "itk/ImageIOs/itkGE5ImageIOJSBinding.js",
    "revision": "68e27a17ae0f300726ed2a44e21faecc"
  },
  {
    "url": "itk/ImageIOs/itkGE5ImageIOJSBindingWasm.js",
    "revision": "269238c7d56c12ad425abdf257fcac05"
  },
  {
    "url": "itk/ImageIOs/itkGEAdwImageIOJSBinding.js",
    "revision": "7b426ce06c3fd7431d6865e8b2b94e27"
  },
  {
    "url": "itk/ImageIOs/itkGEAdwImageIOJSBindingWasm.js",
    "revision": "306b4a14490df9735f73fd67308b4737"
  },
  {
    "url": "itk/ImageIOs/itkGiplImageIOJSBinding.js",
    "revision": "786457f6d8dd4f6e8a48bd000531d21f"
  },
  {
    "url": "itk/ImageIOs/itkGiplImageIOJSBindingWasm.js",
    "revision": "a44f811107493fb2aa10e9b7eba80f8c"
  },
  {
    "url": "itk/ImageIOs/itkHDF5ImageIOJSBindingWasm.js",
    "revision": "e538a1122063622d9a25119947a8bd9f"
  },
  {
    "url": "itk/ImageIOs/itkJPEGImageIOJSBinding.js",
    "revision": "d52ff5bacd829edc8d1cfbb2bcb3aa14"
  },
  {
    "url": "itk/ImageIOs/itkJPEGImageIOJSBindingWasm.js",
    "revision": "54e220cdef7bddcb4379e2802a911e1a"
  },
  {
    "url": "itk/ImageIOs/itkJSONImageIOJSBinding.js",
    "revision": "2ab12566b42e63881e1eb857034807c4"
  },
  {
    "url": "itk/ImageIOs/itkJSONImageIOJSBindingWasm.js",
    "revision": "bfb9e743c1f90651cb0b454f3280a921"
  },
  {
    "url": "itk/ImageIOs/itkLSMImageIOJSBinding.js",
    "revision": "fb5ebe1a92f78c2be25a534ce4f34226"
  },
  {
    "url": "itk/ImageIOs/itkLSMImageIOJSBindingWasm.js",
    "revision": "f602f7b442552aee5f2da005a5b3477a"
  },
  {
    "url": "itk/ImageIOs/itkMetaImageIOJSBinding.js",
    "revision": "d9e79ae739b2975c35bfafa77dce4da6"
  },
  {
    "url": "itk/ImageIOs/itkMetaImageIOJSBindingWasm.js",
    "revision": "b284ac20261dfa179d7b16826d7437f3"
  },
  {
    "url": "itk/ImageIOs/itkMGHImageIOJSBinding.js",
    "revision": "b019eb9f71cf2b55baccb43b3dc50df2"
  },
  {
    "url": "itk/ImageIOs/itkMGHImageIOJSBindingWasm.js",
    "revision": "ed13fbc1e0b6245d09337aae88e94a0b"
  },
  {
    "url": "itk/ImageIOs/itkMINCImageIOJSBindingWasm.js",
    "revision": "96a0b699d23190593568f70e38db7953"
  },
  {
    "url": "itk/ImageIOs/itkMRCImageIOJSBinding.js",
    "revision": "0f64069fa5cb263ee650882fd697d558"
  },
  {
    "url": "itk/ImageIOs/itkMRCImageIOJSBindingWasm.js",
    "revision": "b5a8502e1a4bbf0c426beba0967e925e"
  },
  {
    "url": "itk/ImageIOs/itkNiftiImageIOJSBinding.js",
    "revision": "84973598d58a7fc3f2d4e37205d0081e"
  },
  {
    "url": "itk/ImageIOs/itkNiftiImageIOJSBindingWasm.js",
    "revision": "383c9d6daf5ad54597e7f1d6317a0e66"
  },
  {
    "url": "itk/ImageIOs/itkNrrdImageIOJSBinding.js",
    "revision": "51a6a0f9e8dea747d39a6c07a04a5ebe"
  },
  {
    "url": "itk/ImageIOs/itkNrrdImageIOJSBindingWasm.js",
    "revision": "981f43c77914bbbf5112f8c8e7680c18"
  },
  {
    "url": "itk/ImageIOs/itkPNGImageIOJSBinding.js",
    "revision": "4a009ffa0b38a2c4104222a7ccba2ab9"
  },
  {
    "url": "itk/ImageIOs/itkPNGImageIOJSBindingWasm.js",
    "revision": "aee5e8d94c49e108ddaf56b1086b641d"
  },
  {
    "url": "itk/ImageIOs/itkTIFFImageIOJSBinding.js",
    "revision": "b3ceb9f714b9daf1db94f37c31c34a76"
  },
  {
    "url": "itk/ImageIOs/itkTIFFImageIOJSBindingWasm.js",
    "revision": "5781688f73bbc020277b1eeafb6ee18e"
  },
  {
    "url": "itk/ImageIOs/itkVTKImageIOJSBinding.js",
    "revision": "f5761e92800234ba4c07b0463bb170af"
  },
  {
    "url": "itk/ImageIOs/itkVTKImageIOJSBindingWasm.js",
    "revision": "6d90014797ac5ad6e4c4b103cd716625"
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
    "revision": "91a66a44d662570155b1c357a3ee921e"
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
    "revision": "c693a106b22461ca55b8112cb738bb1b"
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
    "revision": "3f5b600a4a6482b50f4584ec1f862e59"
  },
  {
    "url": "itk/loadEmscriptenModuleNode.js",
    "revision": "662f4d63587344b9304226d96222833f"
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
    "revision": "51029835966fbc36071d469f5a7da02e"
  },
  {
    "url": "itk/MeshIOs/itkBYUMeshIOJSBindingWasm.js",
    "revision": "d9e838418bda0dad38529a753f906903"
  },
  {
    "url": "itk/MeshIOs/itkFreeSurferAsciiMeshIOJSBinding.js",
    "revision": "a002435aea1794f6c3667062d35e18ba"
  },
  {
    "url": "itk/MeshIOs/itkFreeSurferAsciiMeshIOJSBindingWasm.js",
    "revision": "4fb2730a7211ca07224cc047f3599eae"
  },
  {
    "url": "itk/MeshIOs/itkFreeSurferBinaryMeshIOJSBinding.js",
    "revision": "c6d13eb3c7d55205b356f2a64d952ee5"
  },
  {
    "url": "itk/MeshIOs/itkFreeSurferBinaryMeshIOJSBindingWasm.js",
    "revision": "7f93d27a9ffec971ddbdbff03bbaabc5"
  },
  {
    "url": "itk/MeshIOs/itkOBJMeshIOJSBinding.js",
    "revision": "efbb347f980c817ca8b18703a9a9a8e3"
  },
  {
    "url": "itk/MeshIOs/itkOBJMeshIOJSBindingWasm.js",
    "revision": "32a57d8dc2683a59b418659e49df63b5"
  },
  {
    "url": "itk/MeshIOs/itkOFFMeshIOJSBinding.js",
    "revision": "74c9135535b04248860bbf320cc38cc2"
  },
  {
    "url": "itk/MeshIOs/itkOFFMeshIOJSBindingWasm.js",
    "revision": "82c055541c7fc9f8e432626fb9b9fc05"
  },
  {
    "url": "itk/MeshIOs/itkSTLMeshIOJSBinding.js",
    "revision": "a7cf601ca0461e90f18353662eeb1a62"
  },
  {
    "url": "itk/MeshIOs/itkSTLMeshIOJSBindingWasm.js",
    "revision": "e0ed687b4478b8298c7f69db26e67c01"
  },
  {
    "url": "itk/MeshIOs/itkVTKPolyDataMeshIOJSBinding.js",
    "revision": "6c93ddac2d4a8af95033cfd473a3ade3"
  },
  {
    "url": "itk/MeshIOs/itkVTKPolyDataMeshIOJSBindingWasm.js",
    "revision": "9b7b782025ad543ee6a72240e8048a66"
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
    "url": "itk/Pipelines/itkfiltering.js",
    "revision": "6b3e4f74e91da0b5c06beea13bc93985"
  },
  {
    "url": "itk/Pipelines/itkfilteringWasm.js",
    "revision": "e14b48e1bf552a5beebada601e900c8c"
  },
  {
    "url": "itk/Pipelines/MeshToPolyDataWasm.js",
    "revision": "27e14233ea01fb91e9c26d8b3823e05e"
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
    "url": "itk/PolyDataIOs/VTKExodusFileReaderWasm.js",
    "revision": "f30bb75241a7416d180eaa83b73135eb"
  },
  {
    "url": "itk/PolyDataIOs/VTKLegacyFileReaderWasm.js",
    "revision": "a924d42e01183aa93fd53919f66dac1b"
  },
  {
    "url": "itk/PolyDataIOs/VTKXMLFileReaderWasm.js",
    "revision": "2a8cdb69f0c702ea312acb18c500a6a0"
  },
  {
    "url": "itk/readArrayBuffer.js",
    "revision": "52c7067839ff7a061d7b7ab36c6f3060"
  },
  {
    "url": "itk/readBlob.js",
    "revision": "b9c4329a7319055ed6fa6bc207f38c26"
  },
  {
    "url": "itk/readFile.js",
    "revision": "3050ea678e543b5d76ca2f3939516e59"
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
    "revision": "09aa41c003f38c07e27c741a183db1a1"
  },
  {
    "url": "itk/readImageEmscriptenFSDICOMFileSeries.js",
    "revision": "2364488c28e28b558fa0409fc0e1e5f8"
  },
  {
    "url": "itk/readImageEmscriptenFSFile.js",
    "revision": "9dcb75216b2bcc76fb82a17a3efd49d3"
  },
  {
    "url": "itk/readImageFile.js",
    "revision": "b81c1188ec577b66e79420da34efafcf"
  },
  {
    "url": "itk/readImageHTTP.js",
    "revision": "f04f1a3ff720ee054062fe72e7c17953"
  },
  {
    "url": "itk/readImageLocalDICOMFileSeries.js",
    "revision": "ae400fe4b398d153b238c3235a9bd359"
  },
  {
    "url": "itk/readImageLocalDICOMFileSeriesSync.js",
    "revision": "f5304b91ab32c64e97cb7914073e1e09"
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
    "revision": "3e4fbdd59d13e372d685d6f6c0ab8438"
  },
  {
    "url": "itk/readPolyDataBlob.js",
    "revision": "054aebd1b227eb71dc9220dc32c2bde5"
  },
  {
    "url": "itk/readPolyDataFile.js",
    "revision": "c4d76cf30c4d6b3d16d7a7c5d01c4831"
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
    "revision": "2c996749c20c37aee6df7a7fc6818300"
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
    "url": "itk/stackImages.js",
    "revision": "68382b996c21f8e4d5167f6b1a63a8b8"
  },
  {
    "url": "itk/umd/index.html",
    "revision": "760b6d2e85900ffc70fff6cdb5f721a9"
  },
  {
    "url": "itk/umd/itk.js",
    "revision": "fa01d10d6bb6ae91d0ae4da1d3921231"
  },
  {
    "url": "itk/WebWorkers/ImageIO.worker.js",
    "revision": "23d4b6c43256f4ccdd81f1c4fc5674b7"
  },
  {
    "url": "itk/WebWorkers/MeshIO.worker.js",
    "revision": "5372472d98976bd0401d2e084423fa0b"
  },
  {
    "url": "itk/WebWorkers/Pipeline.worker.js",
    "revision": "d0e89de85c3333a785bde87e3b09b122"
  },
  {
    "url": "itk/WorkerPool.js",
    "revision": "fc37ac0d509aaa7f1edaff37d44cdcab"
  },
  {
    "url": "itk/writeArrayBuffer.js",
    "revision": "30d656c5e27d8146da1c971482dd8706"
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
    "url": "version.js",
    "revision": "3f3b5b4ff0aebba41211168ac2f6e320"
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
