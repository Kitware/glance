import macro from '@kitware/vtk.js/macro';

const { vtkErrorMacro } = macro;

// ----------------------------------------------------------------------------
// vtkLabelMapToImageFilter methods
// ----------------------------------------------------------------------------

function vtkLabelMapToImageFilter(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkLabelMapToImageFilter');

  publicAPI.requestData = (inData, outData) => {
    const labelMap = inData[0];

    if (!labelMap || !labelMap.isA || !labelMap.isA('vtkLabelMap')) {
      vtkErrorMacro('No labelmap input');
      return;
    }

    /* eslint-disable-next-line */
    outData[0] = labelMap.getImageRepresentation();
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Make this a VTK object
  macro.obj(publicAPI, model);

  macro.algo(publicAPI, model, 1, 1);

  // Object specific methods
  vtkLabelMapToImageFilter(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(
  extend,
  'vtkLabelMapToImageFilter'
);

// ----------------------------------------------------------------------------

export default { newInstance, extend };
