import macro                    from 'vtk.js/Sources/macro';
import vtkImageSlice            from 'vtk.js/Sources/Rendering/Core/ImageSlice';
import vtkImageMapper           from 'vtk.js/Sources/Rendering/Core/ImageMapper';

import vtkAbstractRepresentation from './AbstractRepresentation';

const REPRESENTATION_STATE = {
  visibility: {
    label: 'Visibility',
    domain: { type: 'boolean' },
    value: { actor: 'visibility' },
  },
  colorWindow: {
    label: 'Color Window',
    domain: { type: 'range', range: [0, 255] },
    value: { property: 'colorWindow' },
  },
  colorLevel: {
    label: 'Color Level',
    domain: { type: 'range', range: [0, 255] },
    value: { property: 'colorLevel' },
  },
  sliceIndex: {
    label: 'Slice index',
    domain: { type: 'range', range: [0, 255] },
    value: { this: 'sliceIndex' },
  },
};

function updateDomains(dataset, { properties, slicingMode }) {
  const dataArray = dataset.getPointData().getScalars() || dataset.getPointData().getArrays()[0];
  const dataRange = dataArray.getRange();
  const extent = dataset.getExtent();
  const axisIndex = 'XYZ'.indexOf(slicingMode);

  properties.sliceIndex.domain.range = [extent[axisIndex * 2], extent[(axisIndex * 2) + 1]];
  properties.colorWindow.domain.range = [0, dataRange[1] - dataRange[0]];
  properties.colorLevel.domain.range = [0, 0.5 * (dataRange[1] + dataRange[0])];
}

// ----------------------------------------------------------------------------
// vtkSliceRepresentation methods
// ----------------------------------------------------------------------------

function vtkSliceRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkSliceRepresentation');
  const superSetInput = publicAPI.setInput;

  // Inspectable object
  model.this = publicAPI;
  model.properties = REPRESENTATION_STATE;

  // API ----------------------------------------------------------------------

  publicAPI.setInput = (source) => {
    superSetInput(source);

    model.mapper = vtkImageMapper.newInstance();
    model.actor = vtkImageSlice.newInstance();
    model.property = model.actor.getProperty();
    model.this = publicAPI;

    vtkAbstractRepresentation.connectMapper(model.mapper, source);
    updateDomains(publicAPI.getInputDataSet(), model);

    // connect rendering pipeline
    model.actor.setMapper(model.mapper);
    model.actors.push(model.actor);
  };

  publicAPI.setSliceIndex = (index) => {
    model.mapper[`set${model.slicingMode}SliceIndex`](index);
    model.sliceIndex = index;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  slicingMode: 'X',
  sliceIndex: 0,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkAbstractRepresentation.extend(publicAPI, model);
  macro.get(publicAPI, model, [
    'properties',
    'sliceIndex',
  ]);

  // Object specific methods
  vtkSliceRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkSliceRepresentation');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
