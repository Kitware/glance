import macro from 'vtk.js/Sources/macro';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';

import vtkAbstractRepresentation from './AbstractRepresentation';

const PROPERTIES_STATE = {
  representation: {
    'Surface with edges': {
      property: { edgeVisibility: true, representation: 2 },
    },
    Surface: { property: { edgeVisibility: false, representation: 2 } },
    Wireframe: { property: { edgeVisibility: false, representation: 1 } },
    Points: { property: { edgeVisibility: false, representation: 0 } },
  },
};

const PROPERTIES_DEFAULT = {
  representation: 'Surface',
};

const PROPERTIES_UI = [
  {
    widget: 'list-1',
    label: 'Representation',
    name: 'representation',
    doc: 'Choose the type for the representation',
    values: ['Surface with edges', 'Surface', 'Wireframe', 'Points'],
    type: 'str',
    advanced: 0,
    size: 1,
  },
  {
    label: 'Opactity',
    name: 'opacity',
    widget: 'slider',
    propType: 'slider',
    type: 'double',
    size: 1,
    domain: { min: 0, max: 1, step: 0.01 },
    doc: 'Adjust object opactity',
  },
  {
    name: 'visibility',
    label: 'Visibility',
    doc: 'Toggle object visibility',
    widget: 'checkbox',
    type: 'boolean',
    advanced: 1,
    size: 1,
  },
];

// ----------------------------------------------------------------------------
// vtkGeometryRepresentation methods
// ----------------------------------------------------------------------------

function vtkGeometryRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkGeometryRepresentation');
  const superSetInput = publicAPI.setInput;

  // parent methods
  model.selectedArray = null; // Default use solid color
  const setSelectedDataArrayParent = publicAPI.setSelectedDataArray;

  // Internals
  model.mapper = vtkMapper.newInstance({
    interpolateScalarsBeforeMapping: true,
    useLookupTableScalarRange: true,
    scalarVisibility: false,
  });
  model.actor = vtkActor.newInstance();
  model.property = model.actor.getProperty();

  // API ----------------------------------------------------------------------

  publicAPI.setInput = (source) => {
    superSetInput(source);
    vtkAbstractRepresentation.connectMapper(model.mapper, source);

    // connect rendering pipeline
    model.actor.setMapper(model.mapper);
    model.actors.push(model.actor);
  };

  publicAPI.setSelectedDataArray = (location, name) => {
    setSelectedDataArrayParent(location, name);

    let colorMode = vtkMapper.ColorMode.DEFAULT;
    let scalarMode = vtkMapper.ScalarMode.DEFAULT;
    const colorByArrayName = name;
    const interpolateScalarsBeforeMapping = location === 'pointData';
    const scalarVisibility = location.length > 0;

    if (scalarVisibility) {
      const activeArray = model.selectedArray.array;
      const newDataRange = activeArray.getRange();
      // dataRange[0] = newDataRange[0];
      // dataRange[1] = newDataRange[1];
      colorMode = vtkMapper.ColorMode.MAP_SCALARS;
      scalarMode =
        location === 'pointData'
          ? vtkMapper.ScalarMode.USE_POINT_FIELD_DATA
          : vtkMapper.ScalarMode.USE_CELL_FIELD_DATA;

      // FIXME handle lookupTable
      model.pipelineManager.setDataRange(name, newDataRange);
      const { lookupTable } = model.pipelineManager.getLookupTableData(name);
      model.mapper.setLookupTable(lookupTable);
    }

    model.mapper.set({
      colorByArrayName,
      colorMode,
      interpolateScalarsBeforeMapping,
      scalarMode,
      scalarVisibility,
    });
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  representation: 'Surface',
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkAbstractRepresentation.extend(publicAPI, model);

  // Object specific methods
  vtkGeometryRepresentation(publicAPI, model);

  // Proxyfy
  macro.proxy(publicAPI, model, 'Representation', PROPERTIES_UI);
  macro.proxyPropertyState(
    publicAPI,
    model,
    PROPERTIES_STATE,
    PROPERTIES_DEFAULT
  );
  macro.proxyPropertyMapping(publicAPI, model, {
    opacity: { modelKey: 'property', property: 'opacity' },
    visibility: { modelKey: 'actor', property: 'visibility' },
  });
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(
  extend,
  'vtkGeometryRepresentation'
);

// ----------------------------------------------------------------------------

export default { newInstance, extend };
