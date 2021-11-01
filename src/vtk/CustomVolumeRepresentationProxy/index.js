import macro from '@kitware/vtk.js/macro';
import vtkVolumeRepresentationProxy from '@kitware/vtk.js/Proxy/Representations/VolumeRepresentationProxy';

// ----------------------------------------------------------------------------
// vtkCustomVolumeRepresentationProxy methods
// ----------------------------------------------------------------------------

function vtkCustomVolumeRepresentationProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCustomVolumeRepresentationProxy');

  const superClass = { ...publicAPI };

  publicAPI.setColorBy = (arrayName, arrayLocation, componentIndex = -1) => {
    superClass.setColorBy(arrayName, arrayLocation, componentIndex);

    if (arrayName === null || !model.sliceUseColorByForColor) {
      model.propertySlices.setRGBTransferFunction(0, null);
    }
    if (arrayName === null || !model.sliceUseColorByForOpacity) {
      model.propertySlices.setPiecewiseFunction(0, null);
    }

    if (arrayName && arrayLocation) {
      if (model.sliceUseColorByForColor) {
        const lutProxy = publicAPI.getLookupTableProxy(arrayName);
        model.propertySlices.setRGBTransferFunction(
          0,
          lutProxy.getLookupTable()
        );
      }
      if (model.sliceUseColorByForOpacity) {
        const pwfProxy = publicAPI.getPiecewiseFunctionProxy(arrayName);
        model.propertySlices.setPiecewiseFunction(
          0,
          pwfProxy.getPiecewiseFunction()
        );
      }
    }
  };

  publicAPI.setSliceOpacity = (opacity) => {
    if (opacity >= 0 && opacity <= 1 && superClass.setSliceOpacity(opacity)) {
      model.propertySlices.setOpacity(opacity);
    }
  };

  publicAPI.setSliceUseColorByForColor = (flag) => {
    if (superClass.setSliceUseColorByForColor(flag)) {
      const colorBy = publicAPI.getColorBy();
      publicAPI.setColorBy(...colorBy);
    }
  };

  publicAPI.setSliceUseColorByForOpacity = (flag) => {
    if (superClass.setSliceUseColorByForOpacity(flag)) {
      const colorBy = publicAPI.getColorBy();
      publicAPI.setColorBy(...colorBy);
    }
  };

  publicAPI.setIs2DVolume = (is2D) => {
    superClass.setIs2DVolume(is2D);
    if (is2D) {
      publicAPI.setSliceUseColorByForColor(true);
      publicAPI.setSliceUseColorByForOpacity(true);
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  sliceOpacity: 1,
  sliceUseColorByForColor: false,
  sliceUseColorByForOpacity: false,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkVolumeRepresentationProxy.extend(publicAPI, model);

  macro.setGet(publicAPI, model, [
    'sliceOpacity',
    'sliceUseColorByForColor',
    'sliceUseColorByForOpacity',
  ]);

  // Object specific methods
  vtkCustomVolumeRepresentationProxy(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(
  extend,
  'vtkCustomVolumeRepresentationProxy'
);

// ----------------------------------------------------------------------------

export default { newInstance, extend };
