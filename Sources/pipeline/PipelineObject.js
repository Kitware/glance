import macro from 'vtk.js/Sources/macro';

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

let instanceId = 1;

function getNextId() {
  return instanceId++;
}

// ----------------------------------------------------------------------------
// vtkPipelineObject methods
// ----------------------------------------------------------------------------

function vtkPipelineObject(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkPipelineObject');
  model.id = getNextId();

  // --------------------------------------------------------------------------

  publicAPI.updateProperties = (state) => {
    if (!state) {
      return;
    }
    const keys = Object.keys(state);
    let count = keys.length;
    while (count--) {
      const key = keys[count];
      model[key].set(state[key]);
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.getPropertyValues = (ui) => {
    const id = model.id;
    const values = [];
    for (let i = 0; i < ui.length; i++) {
      const { name, valueMapping } = ui[i];
      const { modelKey, property } = valueMapping;
      const value = model[modelKey].getReferenceByName(property);
      values.push({ id, name, value });
    }
    return values;
  };

  // --------------------------------------------------------------------------

  publicAPI.getPropertySection = () => {
    const ui = model.ui;
    const properties = publicAPI.getPropertyValues(ui);
    return { name: model.sectionName, collapsed: model.collapsed, ui, properties };
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  collapsed: false,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['id']);
  macro.setGet(publicAPI, model, ['collapsed']);

  // Object specific methods
  vtkPipelineObject(publicAPI, model);
}

export default { extend };
