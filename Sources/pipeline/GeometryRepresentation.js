import macro                      from 'vtk.js/Sources/macro';
import vtkActor                   from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper                  from 'vtk.js/Sources/Rendering/Core/Mapper';

import helper from './helper';
import vtkAbstractRepresentation  from './AbstractRepresentation';

const PROPERTIES_STATE = {
  representation: {
    'Surface with edges': { property: { edgeVisibility: true, representation: 2 } },
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
    values: [
      'Surface with edges',
      'Surface',
      'Wireframe',
      'Points',
    ],
    type: 'str',
    advanced: 0,
    size: 1,
    valueMapping: { modelKey: 'this', property: 'representation' },
  }, {
    label: 'Opactity',
    name: 'opacity',
    widget: 'slider',
    propType: 'slider',
    type: 'double',
    domain: { min: 0, max: 1, step: 0.01 },
    valueMapping: { modelKey: 'property', property: 'opacity' },
  }, {
    name: 'Visibility',
    doc: 'Toggle visibility',
    widget: 'checkbox',
    type: 'boolean',
    advanced: 1,
    size: 1,
    valueMapping: { modelKey: 'actor', property: 'visibility' },
  },
];

// ----------------------------------------------------------------------------
// vtkGeometryRepresentation methods
// ----------------------------------------------------------------------------

function vtkGeometryRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkGeometryRepresentation');
  const superSetInput = publicAPI.setInput;

  // Inspectable object
  model.ui = PROPERTIES_UI;
  model.this = publicAPI;

  // API ----------------------------------------------------------------------

  publicAPI.setInput = (source) => {
    superSetInput(source);

    model.mapper = vtkMapper.newInstance();
    model.actor = vtkActor.newInstance();
    model.property = model.actor.getProperty();

    vtkAbstractRepresentation.connectMapper(model.mapper, source);

    // connect rendering pipeline
    model.actor.setMapper(model.mapper);
    model.actors.push(model.actor);
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
  helper.stateProperties(publicAPI, model, PROPERTIES_STATE, PROPERTIES_DEFAULT);

  // Object specific methods
  vtkGeometryRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkGeometryRepresentation');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
