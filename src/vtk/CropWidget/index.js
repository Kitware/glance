import macro from 'vtk.js/Sources/macro';

import vtkSphereHandleRepresentation from 'vtk.js/Sources/Widgets/Representations/SphereHandleRepresentation';
import vtkOutlineContextRepresentation from 'vtk.js/Sources/Widgets/Representations/OutlineContextRepresentation';
import vtkImageCroppingWidget from 'vtk.js/Sources/Widgets/Widgets3D/ImageCroppingWidget';

import behavior from 'paraview-glance/src/vtk/CropWidget/behavior';

import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkCropWidget(publicAPI, model) {
  model.classHierarchy.push('vtkCropWidget');

  // --- Widget Requirement ---------------------------------------------------

  model.behavior = macro.chain(model.behavior, behavior);

  model.methodsToLink = model.methodsToLink || [];
  model.methodsToLink.push('handleScale');

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
          { builder: vtkOutlineContextRepresentation, labels: ['corners'] },
        ];
    }
  };
}

// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkImageCroppingWidget.extend(publicAPI, model, initialValues);

  vtkCropWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkCropWidget');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
