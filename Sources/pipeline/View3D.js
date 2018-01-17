import macro from 'vtk.js/Sources/macro';
import AbstractView from './AbstractView';

import Palettes from '../Palettes';

// ----------------------------------------------------------------------------
// vtk3DView methods
// ----------------------------------------------------------------------------

function vtk3DView(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtk3DView');

  // Representation mapping
  publicAPI.getRepresentationType = (sourceType) => sourceType;
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  AbstractView.extend(publicAPI, model, initialValues);

  // Object specific methods
  vtk3DView(publicAPI, model);

  macro.proxy(publicAPI, model, 'View 3D', [
    {
      label: 'Background Color',
      name: 'background',
      propType: 'Color',
      type: 'double',
      size: 3,
      doc: 'RGB mapping of the background color with values between 0 and 1.0',
      domain: {
        palette: Palettes.spectral.concat('#ffffff00'),
      },
    },
  ]);
}
// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtk3DView');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
