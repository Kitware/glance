import macro from '@kitware/vtk.js/macro';
import vtkSliceRepresentationProxy from '@kitware/vtk.js/Proxy/Representations/SliceRepresentationProxy';

// ----------------------------------------------------------------------------
// vtkCustomSliceRepresentationProxy methods
// ----------------------------------------------------------------------------

function vtkCustomSliceRepresentationProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCustomSliceRepresentationProxy');

  const superClass = { ...publicAPI };

  publicAPI.setOpacity = (opacity) => {
    if (opacity >= 0 && opacity <= 1 && superClass.setOpacity(opacity)) {
      model.property.setOpacity(opacity);
    }
  };

  publicAPI.setColorBy = (arrayName, arrayLocation, componentIndex = -1) => {
    superClass.setColorBy(arrayName, arrayLocation, componentIndex);

    if (arrayName === null || !model.useColorByForColor) {
      model.property.setRGBTransferFunction(0, null);
    }
    if (arrayName === null || !model.useColorByForOpacity) {
      model.property.setPiecewiseFunction(0, null);
    }

    if (arrayName && arrayLocation) {
      if (model.useColorByForColor) {
        const lutProxy = publicAPI.getLookupTableProxy(arrayName);
        model.property.setRGBTransferFunction(0, lutProxy.getLookupTable());
      }
      if (model.useColorByForOpacity) {
        const pwfProxy = publicAPI.getPiecewiseFunctionProxy(arrayName);
        model.property.setPiecewiseFunction(0, pwfProxy.getPiecewiseFunction());
      }
    }
  };

  publicAPI.setUseColorByForColor = (flag) => {
    if (superClass.setUseColorByForColor(flag)) {
      const colorBy = publicAPI.getColorBy();
      publicAPI.setColorBy(...colorBy);
    }
  };

  publicAPI.setUseColorByForOpacity = (flag) => {
    if (superClass.setUseColorByForOpacity(flag)) {
      const colorBy = publicAPI.getColorBy();
      publicAPI.setColorBy(...colorBy);
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  opacity: 1,
  useColorByForColor: false,
  useColorByForOpacity: false,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkSliceRepresentationProxy.extend(publicAPI, model);

  macro.setGet(publicAPI, model, [
    'opacity',
    'useColorByForColor',
    'useColorByForOpacity',
  ]);

  // Object specific methods
  vtkCustomSliceRepresentationProxy(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(
  extend,
  'vtkCustomSliceRepresentationProxy'
);

// ----------------------------------------------------------------------------

export default { newInstance, extend };
