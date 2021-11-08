import macro from '@kitware/vtk.js/macro';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkAbstractRepresentationProxy from '@kitware/vtk.js/Proxy/Core/AbstractRepresentationProxy';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';

import { makeSubManager } from 'paraview-glance/src/utils';

// ----------------------------------------------------------------------------
// vtkLabelMapVolumeRepProxy methods
// ----------------------------------------------------------------------------

function vtkLabelMapVolumeRepProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkLabelMapVolumeRepProxy');

  const labelMapSub = makeSubManager();

  // Volume
  model.mapper = vtkVolumeMapper.newInstance();
  model.volume = vtkVolume.newInstance();
  model.property = model.volume.getProperty();

  model.property.setInterpolationTypeToNearest();

  function updateTransferFunctions(labelmap) {
    const colorMap = labelmap.getColorMap();

    const cfun = vtkColorTransferFunction.newInstance();
    const ofun = vtkPiecewiseFunction.newInstance();

    Object.keys(colorMap).forEach((label) => {
      const l = Number(label);
      cfun.addRGBPoint(l, ...colorMap[label].slice(0, 3).map((c) => c / 255));
      ofun.addPoint(l, colorMap[label][3] / 255);
    });

    model.property.setRGBTransferFunction(0, cfun);
    model.property.setScalarOpacity(0, ofun);

    const maxDim = Math.max(...labelmap.getDimensions());
    model.property.setScalarOpacityUnitDistance(0, Math.sqrt(maxDim));

    const sampleDistance = labelmap
      .getSpacing()
      .map((v) => v * v)
      .reduce((a, b) => a + b, 0);
    model.mapper.setSampleDistance(sampleDistance * 2 ** -1.5);
  }

  model.sourceDependencies.push({
    setInputData(labelmap) {
      if (labelmap) {
        labelMapSub.sub(
          labelmap.onModified(() => updateTransferFunctions(labelmap))
        );
        updateTransferFunctions(labelmap);
        model.mapper.setInputData(labelmap);
      } else {
        // this probably will never happen
        labelMapSub.unsub();
      }
    },
  });

  // connect rendering pipeline
  model.volume.setMapper(model.mapper);
  model.volumes.push(model.volume);

  // API ----------------------------------------------------------------------

  publicAPI.setVisibility = (isVisible) => {
    model.volume.setVisibility(isVisible);
  };

  publicAPI.getVisibility = () => model.volume.getVisibility();

  publicAPI.isVisible = publicAPI.getVisibility;

  publicAPI.delete = macro.chain(publicAPI.delete, () => {
    labelMapSub.unsub();
  });
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkAbstractRepresentationProxy.extend(publicAPI, model);

  // Object specific methods
  vtkLabelMapVolumeRepProxy(publicAPI, model);
  macro.proxyPropertyMapping(publicAPI, model, {
    volumeVisibility: { modelKey: 'volume', property: 'visibility' },
  });
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(
  extend,
  'vtkLabelMapVolumeRepProxy'
);

// ----------------------------------------------------------------------------

export default { newInstance, extend };
