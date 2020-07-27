import macro from 'vtk.js/Sources/macro';
import vtkSliceRepresentationProxy from 'vtk.js/Sources/Proxy/Representations/SliceRepresentationProxy';

// ----------------------------------------------------------------------------
// vtkCustomSliceRepresentationProxy methods
// ----------------------------------------------------------------------------

function vtkCustomSliceRepresentationProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCustomSliceRepresentationProxy');

  const superClass = { ...publicAPI };

  publicAPI.setOpacity = (opacity) => {
    if (opacity >= 0 && opacity <= 1 && superClass.setOpacity(opacity)) {
      model.property.setOpacity(opacity);
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  opacity: 1,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkSliceRepresentationProxy.extend(publicAPI, model);

  macro.setGet(publicAPI, model, ['opacity']);

  // Object specific methods
  vtkCustomSliceRepresentationProxy(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(
  extend,
  'vtkCustomSliceRepresentationProxy'
);

// ----------------------------------------------------------------------------

export default { newInstance, extend };
