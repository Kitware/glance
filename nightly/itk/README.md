itk.js
======

[![CircleCI](https://circleci.com/gh/InsightSoftwareConsortium/itk-js.svg?style=svg)](https://circleci.com/gh/InsightSoftwareConsortium/itk-js)

Provides general scientific image IO capability and bridges
[ITK](https://itk.org) code running in an
[asm.js](http://asmjs.org/) or [WebAssembly](http://webassembly.org/)
runtime environment.

Supported file formats
----------------------

- [BioRad](http://www.bio-rad.com/)
- [BMP](https://en.wikipedia.org/wiki/BMP_file_format)
- [DICOM](http://dicom.nema.org/)
- [DICOM Series](http://dicom.nema.org/)
- [ITK HDF5](https://support.hdfgroup.org/HDF5/)
- [JPEG](https://en.wikipedia.org/wiki/JPEG_File_Interchange_Format)
- [GE4,GE5,GEAdw](http://www3.gehealthcare.com)
- [Gipl (Guys Image Processing Lab)](https://www.ncbi.nlm.nih.gov/pubmed/12956259)
- [LSM](http://www.openwetware.org/wiki/Dissecting_LSM_files)
- [MetaImage](https://itk.org/Wiki/ITK/MetaIO/Documentation)
- [MINC 2.0](https://en.wikibooks.org/wiki/MINC/SoftwareDevelopment/MINC2.0_File_Format_Reference)
- [MGH](https://surfer.nmr.mgh.harvard.edu/fswiki/FsTutorial/MghFormat)
- [MRC](https://en.wikipedia.org/wiki/MRC_(file_format))
- [NifTi](https://nifti.nimh.nih.gov/nifti-1)
- [NRRD](http://teem.sourceforge.net/nrrd/format.html)
- [Portable Network Graphics (PNG)](https://en.wikipedia.org/wiki/Portable_Network_Graphics)
- [Tagged Image File Format (TIFF)](https://en.wikipedia.org/wiki/TIFF)
- [VTK legacy image file format](http://www.vtk.org/VTK/img/file-formats.pdf)

Installation
------------

```bash
npm install --save itk
```

Hacking itk.js
--------------

### Build dependencies

- Node.js / NPM
- Docker

### Building

To build itk.js itself:

```bash
npm install
npm run build
```

Run the tests:
```bash
npm test
```

### Contributing

We use semantic-release for handling change log and version.
Therefore we recommend using the following command line when
creating a commit:

```sh
$ npm run commit
```

Otherwise you can follow the specification available [here](https://gist.github.com/stephenparish/9941e89d80e2bc58a153).
