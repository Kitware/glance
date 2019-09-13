import macro from 'vtk.js/Sources/macro';
import vtkAbstractWidgetFactory from 'vtk.js/Sources/Widgets/Core/AbstractWidgetFactory';
import vtkPlanePointManipulator from 'vtk.js/Sources/Widgets/Manipulators/PlaneManipulator';
import { distance2BetweenPoints } from 'vtk.js/Sources/Common/Core/Math';

import widgetBehavior from 'paraview-glance/src/vtk/TextWidget/behavior';
import stateGenerator from 'paraview-glance/src/vtk/TextWidget/state';

import vtkScaledSphereHandleRepresentation from 'paraview-glance/src/vtk/ScaledSphereHandleRepresentation';
import vtkSVGCircleHandleRepresentation from 'paraview-glance/src/vtk/SVGCircleHandleRepresentation';
import vtkSVGLabelRepresentation from 'paraview-glance/src/vtk/SVGLabelRepresentation';

import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkDistanceWidget(publicAPI, model) {
  model.classHierarchy.push('vtkDistanceWidget');

  // --- Widget Requirement ---------------------------------------------------

  model.methodsToLink = [
    'activeScaleFactor',
    'activeColor',
    'useActiveColor',
    'defaultScale',
    'circleProps',
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
            builder: vtkSVGLabelRepresentation,
            labels: ['handles'],
          },
        ];
    }
  };

  // --- Public methods -------------------------------------------------------

  publicAPI.getDistance = () => {
    const handles = model.widgetState.getHandleList();
    if (handles.length !== 2) {
      return 0;
    }
    return Math.sqrt(
      distance2BetweenPoints(handles[0].getOrigin(), handles[1].getOrigin())
    );
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

  vtkDistanceWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkDistanceWidget');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
