import macro from 'vtk.js/Sources/macro';
import ITKHelper from 'vtk.js/Sources/Common/DataModel/ITKHelper';

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
  publicAPI.parseAsArrayBuffer = (arrayBuffer) => {
    if (!arrayBuffer || arrayBuffer === model.rawDataBuffer) {
      return Promise.resolve();
    }

    model.rawDataBuffer = arrayBuffer;

    return readImageDICOMFileSeries(null, [
      new File([arrayBuffer], model.fileName),
    ])
      .then(({ webWorker, image }) => {
        webWorker.terminate();
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
    publicAPI.parseAsArrayBuffer(model.rawDataBuffer, model.fileName);
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
