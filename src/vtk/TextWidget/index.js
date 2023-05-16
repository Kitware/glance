import macro from '@kitware/vtk.js/macro';
import vtkAbstractWidgetFactory from '@kitware/vtk.js/Widgets/Core/AbstractWidgetFactory';
import vtkPlanePointManipulator from '@kitware/vtk.js/Widgets/Manipulators/PlaneManipulator';
import vtkSphereHandleRepresentation from '@kitware/vtk.js/Widgets/Representations/SphereHandleRepresentation';

import widgetBehavior from 'paraview-glance/src/vtk/TextWidget/behavior';
import stateGenerator from 'paraview-glance/src/vtk/TextWidget/state';

import { ViewTypes } from '@kitware/vtk.js/Widgets/Core/WidgetManager/Constants';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkTextWidget(publicAPI, model) {
  model.classHierarchy.push('vtkTextWidget');

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
          {
            builder: vtkSphereHandleRepresentation,
            labels: ['handles'],
            initialValues: {
              scaleInPixels: true,
            },
          },
          {
            builder: vtkSphereHandleRepresentation,
            labels: ['moveHandle'],
          },
          // {
          //   builder: vtkSVGCircleHandleRepresentation,
          //   labels: ['handles', 'moveHandle'],
          // },
          // {
          //   builder: vtkSVGLabelRepresentation,
          //   labels: ['handles'],
          // },
        ];
    }
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

  vtkTextWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkTextWidget');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
