import macro from 'vtk.js/Sources/macro';
import vtkSphereHandleRepresentation from 'vtk.js/Sources/Widgets/Representations/SphereHandleRepresentation';
import vtkAngleWidget from 'vtk.js/Sources/Widgets/Widgets3D/AngleWidget';

import widgetBehavior from 'paraview-glance/src/vtk/AngleWidget/behavior';
import stateGenerator from 'paraview-glance/src/vtk/AngleWidget/state';

import vtkSVGCircleHandleRepresentation from 'paraview-glance/src/vtk/SVGCircleHandleRepresentation';
import vtkSVGLineRepresentation from 'paraview-glance/src/vtk/SVGLineRepresentation';
import vtkSVGLabelRepresentation from 'paraview-glance/src/vtk/SVGLabelRepresentation';

import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkAngle2DWidget(publicAPI, model) {
  model.classHierarchy.push('vtkAngle2DWidget');

  // --- Widget Requirement ---------------------------------------------------

  model.methodsToLink = [
    ...(model.methodsToLink ?? []),
    'circleProps',
    'lineProps',
    'textProps',
    'text',
    'textStateIndex',
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
            initialValues: {
              scaleInPixels: true,
            },
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
}

// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkAngleWidget.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['manipulator']);

  vtkAngle2DWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkAngle2DWidget');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
