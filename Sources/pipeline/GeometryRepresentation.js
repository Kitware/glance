import macro                      from 'vtk.js/Sources/macro';
import vtkActor                   from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper                  from 'vtk.js/Sources/Rendering/Core/Mapper';

import vtkAbstractRepresentation  from './AbstractRepresentation';

const REPRESENTATION_STATE = {
  visibility: {
    label: 'Visibility',
    domain: { type: 'boolean' },
    value: { actor: 'visibility' },
  },
  opacity: {
    label: 'Opacity',
    domain: { type: 'range', range: [0, 1] },
    value: { property: 'opacity' },
  },
  representation: {
    label: 'Representation',
    domain: {
      type: 'list',
      list: [
        { label: 'Surface with edge', state: { property: { edgeVisibility: true, representation: 2 } } },
        { label: 'Surface', state: { property: { edgeVisibility: false, representation: 2 } } },
        { label: 'Wireframe', state: { property: { edgeVisibility: false, representation: 1 } } },
        { label: 'Points', state: { property: { edgeVisibility: false, representation: 0 } } },
      ],
    },
    value: { this: 'representation' },
  },
};

// ----------------------------------------------------------------------------
// vtkGeometryRepresentation methods
// ----------------------------------------------------------------------------

function vtkGeometryRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkGeometryRepresentation');
  const superSetInput = publicAPI.setInput;

  // Inspectable object
  model.this = publicAPI;
  model.properties = REPRESENTATION_STATE;

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

  // --------------------------------------------------------------------------

  publicAPI.setRepresentation = (name) => {
    const data = REPRESENTATION_STATE.representation.domain.find(i => i.label === name);
    if (data) {
      model.representation = name;
      publicAPI.updateProperties(data.state);
    }
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
  macro.get(publicAPI, model, [
    'representation',
    'properties',
  ]);

  // Object specific methods
  vtkGeometryRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkGeometryRepresentation');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
