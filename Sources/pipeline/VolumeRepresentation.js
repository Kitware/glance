import macro                    from 'vtk.js/Sources/macro';
import vtkBoundingBox           from 'vtk.js/Sources/Common/DataModel/BoundingBox';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction     from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
import vtkVolume                from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper          from 'vtk.js/Sources/Rendering/Core/VolumeMapper';

import vtkAbstractRepresentation from './AbstractRepresentation';

const REPRESENTATION_STATE = {
  visibility: {
    label: 'Visibility',
    domain: { type: 'boolean' },
    value: { actor: 'visibility' },
  },
};

function updateConfiguration(dataset, { lookupTable, piecewiseFunction, mapper, property }) {
  const dataArray = dataset.getPointData().getScalars() || dataset.getPointData().getArrays()[0];
  const dataRange = dataArray.getRange();

  // Configuration
  const sampleDistance = 0.7 * Math.sqrt(dataset.getSpacing().map(v => v * v).reduce((a, b) => a + b, 0));
  mapper.setSampleDistance(sampleDistance);
  property.setRGBTransferFunction(0, lookupTable);
  property.setScalarOpacity(0, piecewiseFunction);
  // actor.getProperty().setInterpolationTypeToFastLinear();
  property.setInterpolationTypeToLinear();

  // For better looking volume rendering
  // - distance in world coordinates a scalar opacity of 1.0
  property.setScalarOpacityUnitDistance(0, vtkBoundingBox.getDiagonalLength(dataset.getBounds()) / Math.max(...dataset.getDimensions()));
  // - control how we emphasize surface boundaries
  //  => max should be around the average gradient magnitude for the
  //     volume or maybe average plus one std dev of the gradient magnitude
  //     (adjusted for spacing, this is a world coordinate gradient, not a
  //     pixel gradient)
  //  => max hack: (dataRange[1] - dataRange[0]) * 0.05
  property.setGradientOpacityMinimumValue(0, 0);
  property.setGradientOpacityMaximumValue(0, (dataRange[1] - dataRange[0]) * 0.05);
  // - Use shading based on gradient
  property.setShade(true);
  property.setUseGradientOpacity(0, true);
  // - generic good default
  property.setGradientOpacityMinimumOpacity(0, 0.0);
  property.setGradientOpacityMaximumOpacity(0, 1.0);
  property.setAmbient(0.2);
  property.setDiffuse(0.7);
  property.setSpecular(0.3);
  property.setSpecularPower(8.0);
}

// ----------------------------------------------------------------------------
// vtkVolumeRepresentation methods
// ----------------------------------------------------------------------------

function vtkVolumeRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkVolumeRepresentation');
  const superSetInput = publicAPI.setInput;

  // Inspectable object
  model.this = publicAPI;
  model.properties = REPRESENTATION_STATE;

  model.lookupTable = vtkColorTransferFunction.newInstance();
  model.piecewiseFunction = vtkPiecewiseFunction.newInstance();


  // API ----------------------------------------------------------------------

  publicAPI.setInput = (source) => {
    superSetInput(source);

    model.mapper = vtkVolumeMapper.newInstance();
    model.volume = vtkVolume.newInstance();
    model.property = model.volume.getProperty();

    vtkAbstractRepresentation.connectMapper(model.mapper, source);
    updateConfiguration(publicAPI.getInputDataSet(), model);

    // connect rendering pipeline
    model.volume.setMapper(model.mapper);
    model.volumes.push(model.volume);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkAbstractRepresentation.extend(publicAPI, model);
  macro.get(publicAPI, model, [
    'properties',
    'lookupTable',
    'piecewiseFunction',
  ]);

  // Object specific methods
  vtkVolumeRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkVolumeRepresentation');

// ----------------------------------------------------------------------------

export default { newInstance, extend, updateConfiguration };
