import macro from 'vtk.js/Sources/macro';

import vtkPipelineObject from './PipelineObject';

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

let instanceId = 1;

function getNextId() {
  return instanceId++;
}

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
  model.id = getNextId();

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
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkPipelineObject.extend(publicAPI, model);
  macro.get(publicAPI, model, [
    'id',
    'name',
    'properties',
    'type',
    'dataset',
    'source',
  ]);
  macro.set(publicAPI, model, [
    'name',
  ]);

  // Object specific methods
  vtkSource(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkSource');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
