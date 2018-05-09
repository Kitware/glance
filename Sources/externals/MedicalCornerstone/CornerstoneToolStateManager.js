import macro from 'vtk.js/Sources/macro';

import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

function CornerstoneToolStateManager(publicAPI, model) {
  model.classHierarchy.push('vtkCornerstoneToolStateManager');

  // Setup --------------------------------------------------------------------

  let measurementId = 1;

  model.imageIdManager = cornerstoneTools.newImageIdSpecificToolStateManager();

  // Public -------------------------------------------------------------------

  publicAPI.add = (element, toolType, data) => {
    const enabledImage = cornerstone.getEnabledElement(element);
    if (!enabledImage.image || !enabledImage.image.imageId) {
      return;
    }

    // Annotate the state data
    Object.assign(data, {
      metadata: {
        measurementId: measurementId++,
        imageId: enabledImage.image.imageId,
        toolType,
      },
    });

    model.imageIdManager.add(element, toolType, data);
  };

  publicAPI.get = model.imageIdManager.get;
  publicAPI.clear = model.imageIdManager.clear;
  publicAPI.restoreToolState = model.imageIdManager.restoreToolState;
  publicAPI.saveToolState = model.imageIdManager.saveToolState;

  publicAPI.getToolState = () => model.imageIdManager.toolState;

  // A wrapper around object.assign that also triggers a
  // measurement modified event.
  publicAPI.setData = (element, toolType, measurementData, newData) => {
    Object.assign(measurementData, newData);

    const evData = {
      toolType,
      element,
      measurementData,
    };

    const eventType = cornerstoneTools.EVENTS.MEASUREMENT_MODIFIED;
    cornerstone.triggerEvent(element, eventType, evData);
  };

  // Removes data regardless of which imageId it's associated with.
  // This complements cornerstoneTools.removeToolState().
  publicAPI.removeData = (element, toolType, measurementData) => {
    const { imageId } = measurementData.metadata;
    const toolData = model.imageIdManager.toolState[imageId][toolType];

    for (let i = 0; i < toolData.data.length; ++i) {
      if (toolData.data[i] === measurementData) {
        toolData.data.splice(i, 1);
        break;
      }
    }

    const evData = {
      toolType,
      element,
      measurementData,
    };

    const eventType = cornerstoneTools.EVENTS.MEASUREMENT_REMOVED;
    cornerstone.triggerEvent(element, eventType, evData);
  };
}

function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, initialValues);

  macro.obj(publicAPI, model);

  CornerstoneToolStateManager(publicAPI, model);
}

export const newInstance = macro.newInstance(
  extend,
  'vtkCornerstoneToolStateManager'
);

export default { newInstance, extend };
