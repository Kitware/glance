import macro from 'vtk.js/Sources/macro';
import vtkSVGRepresentation from 'vtk.js/Sources/Widgets/SVG/SVGRepresentation';

const { createSvgElement } = vtkSVGRepresentation;

// ----------------------------------------------------------------------------
// vtkSVGLabelRepresentation
// ----------------------------------------------------------------------------

function vtkSVGLabelRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkSVGLabelRepresentation');

  publicAPI.render = (widgetState) => {
    const list = publicAPI.getRepresentationStates(widgetState);

    const state = list[model.textStateIndex];
    const coords = [];
    if (state && (!state.isVisible || state.isVisible())) {
      coords.push(state.getOrigin());
    }

    return publicAPI.worldPointsToPixelSpace(coords).then((pixelSpace) => {
      const coords2d = pixelSpace.coords[0];
      const winHeight = pixelSpace.windowSize[1];

      const text = createSvgElement('text');
      Object.keys(model.textProps || {}).forEach((prop) =>
        text.setAttribute(prop, model.textProps[prop])
      );

      if (coords2d) {
        text.setAttribute('x', coords2d[0]);
        text.setAttribute('y', winHeight - coords2d[1]);
        text.textContent = model.text;
      }
      return text;
    });
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  text: 'Label',
  textStateIndex: 0,
  textProps: {
    fill: '#ff0000',
    dx: 12,
    dy: -12,
  },
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkSVGRepresentation.extend(publicAPI, model, initialValues);

  macro.setGet(publicAPI, model, ['textStateIndex', 'textProps', 'text']);

  // Object specific methods
  vtkSVGLabelRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(
  extend,
  'vtkSVGLabelRepresentation'
);

// ----------------------------------------------------------------------------

export default { extend, newInstance };
