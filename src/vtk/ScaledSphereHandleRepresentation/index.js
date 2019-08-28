import macro from 'vtk.js/Sources/macro';
import vtkSphereHandleRepresentation from 'vtk.js/Sources/Widgets/Representations/SphereHandleRepresentation';

// ----------------------------------------------------------------------------
// vtkScaledSphereHandleRepresentation methods
// ----------------------------------------------------------------------------

function vtkScaledSphereHandleRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkScaledSphereHandleRepresentation');

  const superRequestData = publicAPI.requestData;
  publicAPI.requestData = (inData, outData) => {
    superRequestData(inData, outData);

    // from SphereHandleRepresentation
    const { scale } = model.internalArrays;
    const scaleArray = scale.getData();

    // scaleArray is comprised of single-component scale values
    for (let i = 0; i < scaleArray.length; i++) {
      /**
       * Handle scale is distinct from widget state scale1. This allows us to
       * scale this representation independently of the widget state, dependent
       * only on the associated renderer since handleScale can only be set
       * from the view widget.
       */
      scaleArray[i] *= model.handleScale;
    }

    scale.modified();
    outData[0].modified();
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  handleScale: 1,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkSphereHandleRepresentation.extend(publicAPI, model, initialValues);

  macro.setGet(publicAPI, model, ['handleScale']);

  // Object specific methods
  vtkScaledSphereHandleRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(
  extend,
  'vtkScaledSphereHandleRepresentation'
);

// ----------------------------------------------------------------------------

export default { newInstance, extend };
