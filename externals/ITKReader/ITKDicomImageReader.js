/* eslint-disable-next-line no-unused-vars */
import regeneratorRuntime from 'regenerator-runtime';

import macro from '@kitware/vtk.js/macro';
import ITKHelper from 'paraview-glance/src/vtk/ITKHelper';

import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries';

const { convertItkToVtkImage } = ITKHelper;

function getArrayName(filename) {
  const idx = filename.lastIndexOf('.');
  const name = idx > -1 ? filename.substring(0, idx) : filename;
  return `Scalars ${name}`;
}

// ----------------------------------------------------------------------------
// vtkITKDicomImageReader methods
// ----------------------------------------------------------------------------

function vtkITKDicomImageReader(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkITKDicomImageReader');

  // Returns a promise to signal when image is ready
  publicAPI.readFileSeries = (files) => {
    if (!files || !files.length || files === model.files) {
      return Promise.resolve();
    }

    model.files = files;

    return readImageDICOMFileSeries(files)
      .then(({ image }) => {
        return image;
      })
      .then((itkImage) => {
        const imageData = convertItkToVtkImage(itkImage, {
          scalarArrayName: model.arrayName || getArrayName(model.fileName),
        });
        model.output[0] = imageData;

        publicAPI.modified();
      });
  };

  publicAPI.requestData = (/* inData, outData */) => {
    publicAPI.readFileSeries(model.files, model.fileName);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  fileName: '',
  // If null/undefined a unique array will be generated
  arrayName: null,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);
  macro.algo(publicAPI, model, 0, 1);
  macro.setGet(publicAPI, model, ['fileName', 'arrayName']);

  // vtkITKDicomImageReader methods
  vtkITKDicomImageReader(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkITKDicomImageReader');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
