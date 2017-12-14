import macro from 'vtk.js/Sources/macro';

// ----------------------------------------------------------------------------
// vtkAbstractRepresentation methods
// ----------------------------------------------------------------------------

function vtkPipelineObject(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkPipelineObject');

  // --------------------------------------------------------------------------

  publicAPI.updateProperties = (state) => {
    const keys = Object.keys(state);
    let count = keys.length;
    while (count--) {
      const key = keys[count];
      model[key].set(state[key]);
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.getPropertyValues = () => {
    const values = {};
    const keys = Object.keys(model.properties);
    let count = keys.length;
    while (count--) {
      const key = keys[count];
      values[key] = model[key].getReferenceByName(model.properties[key]);
    }
    return values;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macro.obj(publicAPI, model);

  // Object specific methods
  vtkPipelineObject(publicAPI, model);
}

export default { extend };
