import macro        from 'vtk.js/Sources/macro';
import AbstractView from './AbstractView';

// ----------------------------------------------------------------------------
// vtk3DView methods
// ----------------------------------------------------------------------------

function vtk3DView(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtk3DView');

  // Representation mapping
  publicAPI.getRepresentationType = (sourceType => sourceType);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  AbstractView.extend(publicAPI, model, initialValues);

  // Object specific methods
  vtk3DView(publicAPI, model);
}
// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtk3DView');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
