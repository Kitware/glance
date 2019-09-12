import macro from 'vtk.js/Sources/macro';
import vtkAbstractWidgetFactory from 'vtk.js/Sources/Widgets/Core/AbstractWidgetFactory';
import vtkPlanePointManipulator from 'vtk.js/Sources/Widgets/Manipulators/PlaneManipulator';
import * as vtkMath from 'vtk.js/Sources/Common/Core/Math';

import widgetBehavior from 'paraview-glance/src/vtk/AngleWidget/behavior';
import stateGenerator from 'paraview-glance/src/vtk/AngleWidget/state';

import vtkScaledSphereHandleRepresentation from 'paraview-glance/src/vtk/ScaledSphereHandleRepresentation';
import vtkSVGCircleHandleRepresentation from 'paraview-glance/src/vtk/SVGCircleHandleRepresentation';
import vtkSVGLineRepresentation from 'paraview-glance/src/vtk/SVGLineRepresentation';
import vtkSVGLabelRepresentation from 'paraview-glance/src/vtk/SVGLabelRepresentation';

import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkAngleWidget(publicAPI, model) {
  model.classHierarchy.push('vtkAngleWidget');

  // --- Widget Requirement ---------------------------------------------------

  model.methodsToLink = [
    'activeScaleFactor',
    'activeColor',
    'useActiveColor',
    'glyphResolution',
    'defaultScale',
    'circleProps',
    'lineProps',
    'textProps',
    'text',
    'textStateIndex',
    'handleScale',
  ];
  model.behavior = widgetBehavior;
  model.widgetState = stateGenerator();

  publicAPI.getRepresentationsForViewType = (viewType) => {
    switch (viewType) {
      case ViewTypes.DEFAULT:
      case ViewTypes.GEOMETRY:
      case ViewTypes.SLICE:
      case ViewTypes.VOLUME:
      default:
        return [
          { builder: vtkScaledSphereHandleRepresentation, labels: ['handles'] },
          {
            builder: vtkScaledSphereHandleRepresentation,
            labels: ['moveHandle'],
          },
          {
            builder: vtkSVGCircleHandleRepresentation,
            labels: ['handles', 'moveHandle'],
          },
          {
            builder: vtkSVGLineRepresentation,
            labels: ['handles', 'moveHandle'],
          },
          {
            builder: vtkSVGLabelRepresentation,
            labels: ['handles'],
          },
        ];
    }
  };

  // --- Public methods -------------------------------------------------------

  // Returns angle in radians
  publicAPI.getAngle = () => {
    const handles = model.widgetState.getHandleList();
    if (handles.length !== 3) {
      return 0;
    }

    const vec1 = [0, 0, 0];
    const vec2 = [0, 0, 0];
    vtkMath.subtract(handles[0].getOrigin(), handles[1].getOrigin(), vec1);
    vtkMath.subtract(handles[2].getOrigin(), handles[1].getOrigin(), vec2);
    return vtkMath.angleBetweenVectors(vec1, vec2);
  };

  // --------------------------------------------------------------------------
  // initialization
  // --------------------------------------------------------------------------

  model.widgetState.onBoundsChange((bounds) => {
    const center = [
      (bounds[0] + bounds[1]) * 0.5,
      (bounds[2] + bounds[3]) * 0.5,
      (bounds[4] + bounds[5]) * 0.5,
    ];
    model.widgetState.getMoveHandle().setOrigin(center);
  });

  // Default manipulator
  model.manipulator = vtkPlanePointManipulator.newInstance();
}

// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  // manipulator: null,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkAbstractWidgetFactory.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['manipulator']);

  vtkAngleWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkAngleWidget');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
