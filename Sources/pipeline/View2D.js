import macro from 'vtk.js/Sources/macro';
import vtkMatrixBuilder from 'vtk.js/Sources/Common/Core/MatrixBuilder';

import AbstractView from './AbstractView';
import Palettes from '../Palettes';

// ----------------------------------------------------------------------------
// vtk2DView methods
// ----------------------------------------------------------------------------

function vtk2DView(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtk2DView');

  // Representation mapping
  publicAPI.getRepresentationType = (sourceType) => {
    if (sourceType === 'Volume') {
      return `Slice${'XYZ'[model.axis]}`;
    }
    if (sourceType === 'Geometry') {
      return sourceType;
    }
    return null;
  };

  publicAPI.updateOrientation = (axisIndex, orientation, viewUp) => {
    model.axis = axisIndex;
    model.orientation = orientation;
    model.viewUp = viewUp;
    const position = model.camera.getFocalPoint();
    position[model.axis] += model.orientation;
    model.camera.setPosition(...position);
    model.camera.setViewUp(...viewUp);

    let count = model.representations.length;
    while (count--) {
      publicAPI.removeRepresentation(model.representations[count]);
    }

    publicAPI.updateCornerAnnotation({ axis: 'XYZ'[axisIndex] });
  };

  publicAPI.rotate = (angle) => {
    const { viewUp, focalPoint, position } = model.camera.get(
      'viewUp',
      'focalPoint',
      'position'
    );
    const axis = [
      focalPoint[0] - position[0],
      focalPoint[1] - position[1],
      focalPoint[2] - position[2],
    ];

    vtkMatrixBuilder
      .buildFromDegree()
      .rotate(Number.isNaN(angle) ? 90 : angle, axis)
      .apply(viewUp);

    model.camera.setViewUp(...viewUp);
    model.camera.modified();
    model.renderWindow.render();
  };

  publicAPI.updateOrientation(model.axis, model.orientation, model.viewUp);

  // Setup default corner annotation
  /* eslint-disable no-template-curly-in-string */
  publicAPI.setCornerAnnotation(
    'nw',
    'Orientation ${axis}<br>Slice ${sliceIndex}'
  );
  publicAPI.setCornerAnnotation('se', 'CW ${colorWindow}<br>CL ${colorLevel}');
  /* eslint-enable no-template-curly-in-string */
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  axis: 2,
  orientation: -1,
  viewUp: [0, 1, 0],
  useParallelRendering: true,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  AbstractView.extend(publicAPI, model, initialValues);
  macro.set(publicAPI, model, ['orientation']);
  macro.get(publicAPI, model, ['axis']);

  // Object specific methods
  vtk2DView(publicAPI, model);

  macro.proxy(publicAPI, model, 'View 2D', [
    {
      label: 'Background Color',
      name: 'background',
      propType: 'Color',
      type: 'double',
      size: 3,
      doc: 'RGB mapping of the background color with values between 0 and 1.0',
      domain: {
        palette: Palettes.extended.concat('fff', '000', '#ffffff00'),
      },
    },
  ]);
}
// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtk2DView');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
