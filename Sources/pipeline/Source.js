import macro from 'vtk.js/Sources/macro';

// ----------------------------------------------------------------------------

function getDatasetType(ds) {
  if (ds.isA('vtkPolyData')) {
    return 'Geometry';
  }
  if (ds.isA('vtkImageData')) {
    return 'Volume';
  }
  console.error('Invalid dataset type', ds);
  console.error('=> className:', ds.getClassName());
  return null;
}

// ----------------------------------------------------------------------------
// vtkSource methods
// ----------------------------------------------------------------------------

function vtkSource(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkSource');
  model.ui = [];

  // Inspectable object
  model.this = publicAPI;
  model.properties = {};

  // API ----------------------------------------------------------------------

  publicAPI.setDataset = (ds) => {
    model.dataset = ds;
    model.type = getDatasetType(ds);
  };

  publicAPI.setInput = (source) => {
    model.source = source;
    publicAPI.setDataset(source.getOutputData());
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  name: 'Default source',
  type: 'Geometry',
  sectionName: 'source',
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, [
    'name',
    'properties',
    'type',
    'dataset',
    'source',
  ]);
  macro.set(publicAPI, model, ['name']);

  // Object specific methods
  vtkSource(publicAPI, model);

  macro.proxy(publicAPI, model, 'Source');
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkSource');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
