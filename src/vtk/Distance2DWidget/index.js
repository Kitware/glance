import macro from '@kitware/vtk.js/macro';
import vtkSphereHandleRepresentation from '@kitware/vtk.js/Widgets/Representations/SphereHandleRepresentation';
import vtkDistanceWidget from '@kitware/vtk.js/Widgets/Widgets3D/DistanceWidget';

import widgetBehavior from 'paraview-glance/src/vtk/Distance2DWidget/behavior';
import stateGenerator from 'paraview-glance/src/vtk/Distance2DWidget/state';

import vtkSVGCircleHandleRepresentation from 'paraview-glance/src/vtk/SVGCircleHandleRepresentation';
import vtkSVGLineRepresentation from 'paraview-glance/src/vtk/SVGLineRepresentation';
import vtkSVGLabelRepresentation from 'paraview-glance/src/vtk/SVGLabelRepresentation';

import { ViewTypes } from '@kitware/vtk.js/Widgets/Core/WidgetManager/Constants';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkDistance2DWidget(publicAPI, model) {
  model.classHierarchy.push('vtkDistance2DWidget');

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

  vtkDistanceWidget.extend(publicAPI, model, initialValues);

  vtkDistance2DWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkDistance2DWidget');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
