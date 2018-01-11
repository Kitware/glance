import macro from 'vtk.js/Sources/macro';

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

  publicAPI.isSourceRepresentation = (id) => model.input.getProxyId() === id;

  publicAPI.isVisible = () => {
    if (model.actors.length) {
      return model.actors[0].getVisibility();
    }
    if (model.volumes.length) {
      return model.volumes[0].getVisibility();
    }
    return false;
  };

  publicAPI.setVisibility = (visible) => {
    let count = model.actors.length;
    while (count--) {
      model.actors[count].setVisibility(visible);
    }
    count = model.volumes.length;
    while (count--) {
      model.volumes[count].setVisibility(visible);
    }
  };

  publicAPI.listDataArrays = () => {
    const arrayList = [];
    if (!model.input) {
      return arrayList;
    }

    const dataset = publicAPI.getInputDataSet();

    // Point data
    const pointData = dataset.getPointData();
    let size = pointData.getNumberOfArrays();
    for (let idx = 0; idx < size; idx++) {
      const array = pointData.getArrayByIndex(idx);
      arrayList.push({
        name: array.getName(),
        location: 'pointData',
        numberOfComponents: array.getNumberOfComponents(),
        dataRange: array.getRange(),
      });
    }

    // Cell data
    const cellData = dataset.getCellData();
    size = cellData.getNumberOfArrays();
    for (let idx = 0; idx < size; idx++) {
      const array = cellData.getArrayByIndex(idx);
      arrayList.push({
        name: array.getName(),
        location: 'cellData',
        numberOfComponents: array.getNumberOfComponents(),
        dataRange: array.getRange(),
      });
    }

    return arrayList;
  };

  publicAPI.getSelectedDataArray = () => {
    if (model.selectedArray) {
      return model.selectedArray;
    }

    if (model.selectedArray === null) {
      return { name: '', location: '' };
    }

    const dataset = publicAPI.getInputDataSet();
    const pointData = dataset.getPointData();
    const cellData = dataset.getCellData();

    let array = pointData.getScalars() || pointData.getArrays()[0];
    if (array) {
      model.selectedArray = {
        name: array.getName(),
        location: 'pointData',
        array,
      };
    }
    array = cellData.getScalars() || cellData.getArrays()[0];
    if (array) {
      model.selectedArray = {
        name: array.getName(),
        location: 'cellData',
        array,
      };
    }

    return model.selectedArray;
  };

  publicAPI.setSelectedDataArray = (location, name) => {
    const dataset = publicAPI.getInputDataSet();
    if (!location && !name) {
      model.selectedArray = null;
      return;
    }
    const array = dataset.getReferenceByName(location).getArrayByName(name);
    if (array) {
      model.selectedArray = {
        name,
        location,
        array,
      };
    } else {
      model.selectedArray = null;
    }
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

  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['input', 'actors', 'volumes']);
  macro.setGet(publicAPI, model, ['pipelineManager']);

  // Object specific methods
  vtkAbstractRepresentation(publicAPI, model);
}

export default { extend, connectMapper };
