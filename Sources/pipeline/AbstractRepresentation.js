import macro from 'vtk.js/Sources/macro';
import vtkPipelineObject from './PipelineObject';

// ----------------------------------------------------------------------------

function connectMapper(mapper, input) {
  const source = input.getSource();
  if (source) {
    mapper.setInputConnection(source.getOutputPort());
  } else {
    mapper.setInputData(input.getDataset());
  }
}

// ----------------------------------------------------------------------------
// vtkAbstractRepresentation methods
// ----------------------------------------------------------------------------

function vtkAbstractRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkAbstractRepresentation');

  publicAPI.setInput = (source) => {
    model.input = source;
  };

  publicAPI.getInputDataSet = () => model.input.getDataset();

  publicAPI.isSourceRepresentation = id => (model.input.getId() === Number(id));

  publicAPI.isVisible = () => {
    if (model.actors.length) {
      return model.actors[0].getVisibility();
    }
    if (model.volumes.length) {
      return model.volumes[0].getVisibility();
    }
    return false;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  actors: [],
  volumes: [],
  sectionName: 'representation',
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkPipelineObject.extend(publicAPI, model);
  macro.get(publicAPI, model, [
    'input',
    'actors',
    'volumes',
  ]);

  // Object specific methods
  vtkAbstractRepresentation(publicAPI, model);
}

export default { extend, connectMapper };
