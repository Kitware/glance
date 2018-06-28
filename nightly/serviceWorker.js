importScripts('workbox-sw.prod.v2.1.2.js');

const workboxSW = new self.WorkboxSW({ clientsClaim: true });
workboxSW.precache([
  {
    "url": "glance-external-ITKReader.js",
    "revision": "e47ab58d27f94ede5dc92d126c52f5e4"
  },
  {
    "url": "glance-external-Workbox.js",
    "revision": "c270ac31656c6ed007d64cf880d9b47c"
  },
  {
    "url": "glance.js",
    "revision": "211c45518b4d21a6b2132a40de5cf2e3"
  },
  {
    "url": "index.html",
    "revision": "b1ae8847608928a9132f9576ece6c4a9"
  },
  {
    "url": "itk/createWebworkerPromise.js",
    "revision": "97564f088ab9739f631fcc015095326e"
  },
  {
    "url": "itk/extensionToImageIO.js",
    "revision": "621c30d33ae3dad668d4f522e30da35b"
  },
  {
    "url": "itk/extensionToMeshIO.js",
    "revision": "f065f42ae8e863dd1f1c7f0142a44d58"
  },
  {
    "url": "itk/FloatTypes.js",
    "revision": "d0334ecf8f7df6c4503eaa5bb87cb946"
  },
  {
    "url": "itk/getFileExtension.js",
    "revision": "a41ca1de47ed49c4310bdcecfb035aa9"
  },
  {
    "url": "itk/getMatrixElement.js",
    "revision": "b5b833b11487416068b17f1395023a40"
  },
  {
    "url": "itk/Image.js",
    "revision": "bb3b316224c8fb61dea22095e30a29e5"
  },
  {
    "url": "itk/imageIOComponentToJSComponent.js",
    "revision": "db1d80c3e96dd7133d81eb414e44fd7c"
  },
  {
    "url": "itk/ImageIOIndex.js",
    "revision": "3c3f10bc2accd3ef7417685b35876fdf"
  },
  {
    "url": "itk/imageIOPixelTypeToJSPixelType.js",
    "revision": "8bac11ec37fb155c1d2278ab10f8f5b7"
  },
  {
    "url": "itk/ImageIOs/itkBioRadImageIOJSBinding.js",
    "revision": "23a15088136663426a68cdda5649698c"
  },
  {
    "url": "itk/ImageIOs/itkBioRadImageIOJSBindingWasm.js",
    "revision": "ee469e552c883348142093c5c322e1d1"
  },
  {
    "url": "itk/ImageIOs/itkBMPImageIOJSBinding.js",
    "revision": "e8920292b3ed5af1958354052c3e6668"
  },
  {
    "url": "itk/ImageIOs/itkBMPImageIOJSBindingWasm.js",
    "revision": "9282883296ca9c0ee41714b80b26c074"
  },
  {
    "url": "itk/ImageIOs/itkGE4ImageIOJSBinding.js",
    "revision": "d4bb5a2b2143d9597456c653bd32c8b0"
  },
  {
    "url": "itk/ImageIOs/itkGE4ImageIOJSBindingWasm.js",
    "revision": "75902466d43312c80a3395166e48a0ce"
  },
  {
    "url": "itk/ImageIOs/itkGE5ImageIOJSBinding.js",
    "revision": "81a523e171409f41a540b2542b92d449"
  },
  {
    "url": "itk/ImageIOs/itkGE5ImageIOJSBindingWasm.js",
    "revision": "76645ab4b7d2d5e2a302510a0c127863"
  },
  {
    "url": "itk/ImageIOs/itkGEAdwImageIOJSBinding.js",
    "revision": "0fbadcd10ece63542350c83b7436e64f"
  },
  {
    "url": "itk/ImageIOs/itkGEAdwImageIOJSBindingWasm.js",
    "revision": "9e4de62cce5f5021970261d53770f137"
  },
  {
    "url": "itk/ImageIOs/itkGiplImageIOJSBinding.js",
    "revision": "856757ea44e64acb688595a35970c8d1"
  },
  {
    "url": "itk/ImageIOs/itkGiplImageIOJSBindingWasm.js",
    "revision": "4ea6e9c3a7af3714b940979994113602"
  },
  {
    "url": "itk/ImageIOs/itkJPEGImageIOJSBinding.js",
    "revision": "d3f8c16b7baf8e764da9b816d4d5796a"
  },
  {
    "url": "itk/ImageIOs/itkJPEGImageIOJSBindingWasm.js",
    "revision": "cb4ab435781367d0379e1647a8c01d3d"
  },
  {
    "url": "itk/ImageIOs/itkJSONImageIOJSBinding.js",
    "revision": "a3a5292a2b35a828cda387a3eb91839a"
  },
  {
    "url": "itk/ImageIOs/itkJSONImageIOJSBindingWasm.js",
    "revision": "c65c409bd2ed22d32da70c29bb0d6f1f"
  },
  {
    "url": "itk/ImageIOs/itkLSMImageIOJSBindingWasm.js",
    "revision": "71d8df64fd6fc964e220edde55588d5f"
  },
  {
    "url": "itk/ImageIOs/itkMetaImageIOJSBinding.js",
    "revision": "14d594dcb0c393de93cbbb67bc3da620"
  },
  {
    "url": "itk/ImageIOs/itkMetaImageIOJSBindingWasm.js",
    "revision": "60eb99d8849f962656103ce70173194d"
  },
  {
    "url": "itk/ImageIOs/itkMGHImageIOJSBinding.js",
    "revision": "5214a6bbe5b358df6a1f9a50ebdabbc6"
  },
  {
    "url": "itk/ImageIOs/itkMGHImageIOJSBindingWasm.js",
    "revision": "5c057063a8666f0cb27f9177a31658b7"
  },
  {
    "url": "itk/ImageIOs/itkMRCImageIOJSBinding.js",
    "revision": "b5fb9fcfb97328e360d55d936abb5655"
  },
  {
    "url": "itk/ImageIOs/itkMRCImageIOJSBindingWasm.js",
    "revision": "ca0894af02e9598f0324f904abdca49d"
  },
  {
    "url": "itk/ImageIOs/itkNiftiImageIOJSBinding.js",
    "revision": "a759cdbffc0b2cdd134f3a4f6c33ff8e"
  },
  {
    "url": "itk/ImageIOs/itkNiftiImageIOJSBindingWasm.js",
    "revision": "847aa005de6b6b476348de33ef35b942"
  },
  {
    "url": "itk/ImageIOs/itkNrrdImageIOJSBinding.js",
    "revision": "136c04d8c2d8f4dfb013c0537bb1f3fa"
  },
  {
    "url": "itk/ImageIOs/itkNrrdImageIOJSBindingWasm.js",
    "revision": "5f35d8c47d938971a002a2f23d7dcaf9"
  },
  {
    "url": "itk/ImageIOs/itkPNGImageIOJSBinding.js",
    "revision": "8f235d37504cc81ae425cf459a43ac81"
  },
  {
    "url": "itk/ImageIOs/itkPNGImageIOJSBindingWasm.js",
    "revision": "c1bbf831fc4f813109913e9a2d6aeb32"
  },
  {
    "url": "itk/ImageIOs/itkTIFFImageIOJSBindingWasm.js",
    "revision": "aa1128ef4aa911573e2a74b38a6d0b64"
  },
  {
    "url": "itk/ImageIOs/itkVTKImageIOJSBinding.js",
    "revision": "ab2e300152f9d985300dcd0a3d5e5ade"
  },
  {
    "url": "itk/ImageIOs/itkVTKImageIOJSBindingWasm.js",
    "revision": "ecfe75917489922c916ce7c010afd18d"
  },
  {
    "url": "itk/imageJSComponentToIOComponent.js",
    "revision": "4e034f21237d9338428c0025fbee8004"
  },
  {
    "url": "itk/imageJSPixelTypeToIOPixelType.js",
    "revision": "2680167d52776a3d338ca6640b3f52eb"
  },
  {
    "url": "itk/ImageType.js",
    "revision": "0354aa94e0def279c9d2d183a307a4dc"
  },
  {
    "url": "itk/IntTypes.js",
    "revision": "22eb75dd39729b6e83e15e9738a744b6"
  },
  {
    "url": "itk/IOTypes.js",
    "revision": "0676445d30813fa5c10b47004206a33d"
  },
  {
    "url": "itk/itk-js-cli.js",
    "revision": "c94b55d8f1fd4afec1c917b03c19d8df"
  },
  {
    "url": "itk/itkConfig.js",
    "revision": "8fe4b83c9ffde9a18b7d9b01fa13489f"
  },
  {
    "url": "itk/loadEmscriptenModuleBrowser.js",
    "revision": "93ea7adfbd7faec6c8dcd155b70fa34a"
  },
  {
    "url": "itk/loadEmscriptenModuleNode.js",
    "revision": "760e452c7ac2ce003e3ffece1c88aa84"
  },
  {
    "url": "itk/Matrix.js",
    "revision": "51476f66fdeef8fcbc92975eede104ee"
  },
  {
    "url": "itk/Mesh.js",
    "revision": "7fcb83cd16e75e2bfd3b466fd34e5c81"
  },
  {
    "url": "itk/meshIOComponentToJSComponent.js",
    "revision": "4d044eadc065b7b19f913c492f3b8541"
  },
  {
    "url": "itk/MeshIOIndex.js",
    "revision": "2e038deb932268c26eee62ed8c742bc7"
  },
  {
    "url": "itk/meshIOPixelTypeToJSPixelType.js",
    "revision": "731559c63ae2811471c0769ab97823d2"
  },
  {
    "url": "itk/MeshIOs/itkVTKPolyDataMeshIOJSBindingWasm.js",
    "revision": "1eeeb12c463dc0d7ddfe6aed8f453bb0"
  },
  {
    "url": "itk/meshJSComponentToIOComponent.js",
    "revision": "570183817baa0a6d4ce3764ec43adc3e"
  },
  {
    "url": "itk/meshJSPixelTypeToIOPixelType.js",
    "revision": "5e564b0db331dcdb21d4bc3b4d6d08d3"
  },
  {
    "url": "itk/MeshType.js",
    "revision": "540b9a4494d10050d572a428290974e2"
  },
  {
    "url": "itk/MimeToImageIO.js",
    "revision": "ca9fdab716acbbaa42e77eb3bc59202c"
  },
  {
    "url": "itk/MimeToMeshIO.js",
    "revision": "e6f96acd544b81f845756ae5f696c290"
  },
  {
    "url": "itk/Pipelines/BinShrink.js",
    "revision": "bf3e162fe12005810737a684fc22de51"
  },
  {
    "url": "itk/Pipelines/BinShrinkWasm.js",
    "revision": "de925c07c7d49e4d44defd5fb6d27d53"
  },
  {
    "url": "itk/Pipelines/InputOutputFiles.js",
    "revision": "0451c22aaa8c66becad576ccba377755"
  },
  {
    "url": "itk/Pipelines/InputOutputFilesWasm.js",
    "revision": "8ffdc7fea594ba0fac8eb633153249bf"
  },
  {
    "url": "itk/Pipelines/itkJSPipelinePreBinShrink.js",
    "revision": "1474cbea991810984a7814dcdc96d33e"
  },
  {
    "url": "itk/Pipelines/itkJSPipelinePreInputOutputFiles.js",
    "revision": "4cc141333502c350588f2664ad94b542"
  },
  {
    "url": "itk/Pipelines/itkJSPipelinePreStdoutStderr.js",
    "revision": "51ead2ebb1200bf1dd852b38fb354cd0"
  },
  {
    "url": "itk/Pipelines/StdoutStderr.js",
    "revision": "07ddf2d0e7b0e8fc5ad8b1c81aa163e6"
  },
  {
    "url": "itk/Pipelines/StdoutStderrWasm.js",
    "revision": "c5e2fdba9a15b748e61efa174b6bb67b"
  },
  {
    "url": "itk/PixelTypes.js",
    "revision": "2eec9e5aec083c786b2cafcf885e3ccf"
  },
  {
    "url": "itk/readImageArrayBuffer.js",
    "revision": "d9f74a0c632bfc7216c6c43654b5f900"
  },
  {
    "url": "itk/readImageBlob.js",
    "revision": "172cd1618f3d5b1de2f8c6ea3ef2d2dd"
  },
  {
    "url": "itk/readImageDICOMFileSeries.js",
    "revision": "4d7cdb7e1d3847518e908b5e509ea132"
  },
  {
    "url": "itk/readImageEmscriptenFSDICOMFileSeries.js",
    "revision": "2c6f33ba611fc7f3fcb0fb35e2e9159e"
  },
  {
    "url": "itk/readImageEmscriptenFSFile.js",
    "revision": "0f4c34cf423b2b24c655fced218ce6b4"
  },
  {
    "url": "itk/readImageFile.js",
    "revision": "a314b734ecfcc7f681447f558496dd5c"
  },
  {
    "url": "itk/readImageLocalDICOMFileSeries.js",
    "revision": "b8197769168384852f9850f18e015579"
  },
  {
    "url": "itk/readImageLocalFile.js",
    "revision": "ec47f9cf0803224a35dd136df1227c7b"
  },
  {
    "url": "itk/readMeshArrayBuffer.js",
    "revision": "55d7175b413e3a52795e868c1051a252"
  },
  {
    "url": "itk/readMeshBlob.js",
    "revision": "2a54f32eab7c323afaded0d42a2eefee"
  },
  {
    "url": "itk/readMeshEmscriptenFSFile.js",
    "revision": "c023558ad57865475591060636178e61"
  },
  {
    "url": "itk/readMeshFile.js",
    "revision": "ab396c2c771d6073654d1a87d13e7993"
  },
  {
    "url": "itk/readMeshLocalFile.js",
    "revision": "02be1b63e2d54ccbd7642243bad86ee3"
  },
  {
    "url": "itk/runPipelineBrowser.js",
    "revision": "de9fe82506ef697ec6a1350005f6f5ac"
  },
  {
    "url": "itk/runPipelineEmscripten.js",
    "revision": "44a92caade1616881c908737c7a52547"
  },
  {
    "url": "itk/runPipelineNode.js",
    "revision": "f7fddf272a15e5bfd16e9a62aa863ea8"
  },
  {
    "url": "itk/setMatrixElement.js",
    "revision": "a0099a7c2321a96954e51816e53c6074"
  },
  {
    "url": "itk/WebWorkers/ImageIO.worker.js",
    "revision": "9e8e7f9a7700c2ba29defada3eba7df4"
  },
  {
    "url": "itk/WebWorkers/MeshIO.worker.js",
    "revision": "e3d9568ef315ec3473fc7eb9330df095"
  },
  {
    "url": "itk/WebWorkers/Pipeline.worker.js",
    "revision": "9b6d5e6ba3ad8cd87225aa204381c8b0"
  },
  {
    "url": "itk/writeImageArrayBuffer.js",
    "revision": "2363fd73447e510c892598c4e0c18c8d"
  },
  {
    "url": "itk/writeImageEmscriptenFSFile.js",
    "revision": "445f53522dd0ca67b08dc87217a18c4f"
  },
  {
    "url": "itk/writeImageLocalFile.js",
    "revision": "9736970846932e2c9e610c9d77a87d35"
  },
  {
    "url": "itk/writeMeshArrayBuffer.js",
    "revision": "88fd76ca3d117fe2ff9c2edb30c64a3c"
  },
  {
    "url": "itk/writeMeshEmscriptenFSFile.js",
    "revision": "4c5c883a6babded2c5130ef66f8993c4"
  },
  {
    "url": "itk/writeMeshLocalFile.js",
    "revision": "5892aded0cf4c2c7e8090f9a4ebb71e7"
  },
  {
    "url": "runtime.js",
    "revision": "9202f93a37bfb12f59d16e829f03f73b"
  },
  {
    "url": "workbox-sw.prod.v2.1.2.js",
    "revision": "685d1ceb6b9a9f94aacf71d6aeef8b51"
  }
]);

workboxSW.router.registerRoute(
  /\.js|\.png|\.wasm$/,
  workboxSW.strategies.staleWhileRevalidate({
    cacheName: 'staleWhileRevalidateContent',
    cacheExpiration: {
      maxEntries: 50,
      maxAgeSeconds: 7 * 24 * 60 * 60 * 26,
    },
  })
);
