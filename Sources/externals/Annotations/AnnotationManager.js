import macro from 'vtk.js/Sources/macro';

import * as cornerstone from 'cornerstone-core';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneTools from 'cornerstone-tools';

import { copyCanvas, COPY_CANVAS } from './SUPER_HACK';

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

// ----------------------------------------------------------------------------
// Image format for cornerstone
// ----------------------------------------------------------------------------
// imageId - the imageId associated with this image object
// minPixelValue - the minimum stored pixel value in the image
// maxPixelValue - the maximum stored pixel value in the image
// slope - the rescale slope to convert stored pixel values to modality pixel values or 1 if not specified
// intercept - the rescale intercept used to convert stored pixel values to modality values or 0 if not specified
// windowCenter - the default windowCenter to apply to the image
// windowWidth - the default windowWidth to apply to the image
// getPixelData - a function that returns the underlying pixel data. An array of integers for grayscale and an array of RGBA for color
// getImageData - a function that returns a canvas imageData object for the image. This is only needed for color images
// getCanvas - a function that returns a canvas element with the image loaded into it. This is only needed for color images.
// getImage - a function that returns a JavaScript Image object with the image data. This is optional and typically used for images encoded in standard web JPEG and PNG formats
// rows - number of rows in the image. This is the same as height but duplicated for convenience
// columns - number of columns in the image. This is the same as width but duplicated for convenience
// height - the height of the mage. This is the same as rows but duplicated for convenience
// width - the width of the image. This is the same as columns but duplicated for convenience
// color - true if pixel data is RGB, false if grayscale
// columnPixelSpacing - horizontal distance between the middle of each pixel (or width of each pixel) in mm or undefined if not known
// rowPixelSpacing - vertical distance between the middle of each pixel (or heigh of each pixel) in mm or undefined if not known
// invert - true if the the image should initially be displayed be inverted, false if not. This is here mainly to support DICOM images with a photometric interpretation of MONOCHROME1
// sizeInBytes - the number of bytes used to store the pixels for this image.
// ----------------------------------------------------------------------------

function createEmptyImage(width = 300, height = 300, imageId = 'default') {
  const pixels = new Uint8Array(width * height * 4);
  pixels.fill(0);
  // canvas.width = width;
  // canvas.height = height;
  return {
    imageId,
    minPixelValue: 0,
    maxPixelValue: 255,
    slope: 1,
    intercept: 0,
    windowCenter: 128,
    windowWidth: 255,
    getPixelData() {
      // return canvas.getImageData(0, 0, width, height).data;
      return pixels;
    },
    // getCanvas() {
    //   return canvas;
    // },
    rows: height,
    columns: width,
    height,
    width,
    color: true,
    columnPixelSpacing: undefined,
    rowPixelSpacing: undefined,
    invert: false,
    sizeInBytes: width * height * 4,
    rgba: true,
  };
}

// ----------------------------------------------------------------------------

// function createImageFromCanvas(canvas, imageId = 'canvas') {
//   const { width, height } = canvas;
//   return {
//     imageId,
//     minPixelValue: 0,
//     maxPixelValue: 255,
//     slope: 1,
//     intercept: 0,
//     windowCenter: 128,
//     windowWidth: 255,
//     getCanvas() {
//       return canvas;
//     },
//     rows: height,
//     columns: width,
//     height,
//     width,
//     color: true,
//     columnPixelSpacing: undefined,
//     rowPixelSpacing: undefined,
//     invert: false,
//     sizeInBytes: width * height * 4,
//     rgba: false,
//   };
// }

// ----------------------------------------------------------------------------
// STATIC from cornerstone-tools (could not find correct import path)
// ----------------------------------------------------------------------------

const EVENTS = {
  // Events from Cornerstone Core
  IMAGE_RENDERED: 'cornerstoneimagerendered',
  NEW_IMAGE: 'cornerstonenewimage',
  IMAGE_CACHE_PROMISE_REMOVED: 'cornerstoneimagecachepromiseremoved',
  ELEMENT_DISABLED: 'cornerstoneelementdisabled',

  // Mouse events
  MOUSE_DOWN: 'cornerstonetoolsmousedown',
  MOUSE_UP: 'cornerstonetoolsmouseup',
  MOUSE_DOWN_ACTIVATE: 'cornerstonetoolsmousedownactivate',
  MOUSE_DRAG: 'cornerstonetoolsmousedrag',
  MOUSE_MOVE: 'cornerstonetoolsmousemove',
  MOUSE_CLICK: 'cornerstonetoolsmouseclick',
  MOUSE_DOUBLE_CLICK: 'cornerstonetoolsmousedoubleclick',
  MOUSE_WHEEL: 'cornerstonetoolsmousewheel',

  // Touch events
  TOUCH_START: 'cornerstonetoolstouchstart',
  TOUCH_START_ACTIVE: 'cornerstonetoolstouchstartactive',
  TOUCH_END: 'cornerstonetoolstouchend',
  TOUCH_DRAG: 'cornerstonetoolstouchdrag',
  TOUCH_DRAG_END: 'cornerstonetoolstouchdragend',
  TOUCH_PINCH: 'cornerstonetoolstouchpinch',
  TOUCH_ROTATE: 'cornerstonetoolstouchrotate',
  TOUCH_PRESS: 'cornerstonetoolstouchpress',
  TAP: 'cornerstonetoolstap',
  DOUBLE_TAP: 'cornerstonetoolsdoubletap',
  MULTI_TOUCH_START: 'cornerstonetoolsmultitouchstart',
  MULTI_TOUCH_START_ACTIVE: 'cornerstonetoolsmultitouchstartactive',
  MULTI_TOUCH_DRAG: 'cornerstonetoolsmultitouchdrag',

  // Keyboard events
  KEY_DOWN: 'cornerstonetoolskeydown',
  KEY_UP: 'cornerstonetoolskeyup',
  KEY_PRESS: 'cornerstonetoolskeypress',

  // Measurement / tool events
  MEASUREMENT_ADDED: 'cornerstonetoolsmeasurementadded',
  MEASUREMENT_MODIFIED: 'cornerstonetoolsmeasurementmodified',
  MEASUREMENT_REMOVED: 'cornerstonemeasurementremoved',
  TOOL_DEACTIVATED: 'cornerstonetoolstooldeactivated',
  CLIP_STOPPED: 'cornerstonetoolsclipstopped',
  STACK_SCROLL: 'cornerstonestackscroll', // Should be renamed

  LINE_SAMPLE_UPDATED: 'cornerstonelinesampleupdated',
};

// ----------------------------------------------------------------------------

function vtkAnnotationManager(publicAPI, model) {
  // Internal methods ---------------------------------------------------------
  function attachListeners() {
    if (model.container) {
      model.container.addEventListener(
        EVENTS.IMAGE_RENDERED,
        publicAPI.invokeImageRendered
      );
      model.container.addEventListener(
        EVENTS.MEASUREMENT_ADDED,
        publicAPI.invokeAnnotationAdded
      );
      model.container.addEventListener(
        EVENTS.MEASUREMENT_MODIFIED,
        publicAPI.invokeAnnotationModified
      );
      model.container.addEventListener(
        EVENTS.MEASUREMENT_REMOVED,
        publicAPI.invokeAnnotationRemoved
      );
      model.container.addEventListener(
        EVENTS.MOUSE_UP,
        publicAPI.invokeEditFinished
      );
    }
  }

  function detatchListeners() {
    if (model.container) {
      model.container.removeEventListener(
        EVENTS.IMAGE_RENDERED,
        publicAPI.invokeImageRendered
      );
      model.container.removeEventListener(
        EVENTS.MEASUREMENT_ADDED,
        publicAPI.invokeAnnotationAdded
      );
      model.container.removeEventListener(
        EVENTS.MEASUREMENT_MODIFIED,
        publicAPI.invokeAnnotationModified
      );
      model.container.removeEventListener(
        EVENTS.MEASUREMENT_REMOVED,
        publicAPI.invokeAnnotationRemoved
      );
      model.container.removeEventListener(
        EVENTS.MOUSE_UP,
        publicAPI.invokeEditFinished
      );
    }
  }

  // --------------------------------------------------------------------------

  function createToolAction(action, toolName) {
    return (...args) => {
      if (!model.container) {
        return;
      }
      // console.log(`cornerstoneTools.${toolName}.${action}(${args.join(', ')})`);
      cornerstoneTools[toolName][action](model.container, ...args);
    };
  }

  // --------------------------------------------------------------------------

  function getTextCallback(doneChangingTextCallback) {
    model.doneChangingTextCallback = doneChangingTextCallback;
    model.activeToolData = null;
    publicAPI.invokeEditText();
  }

  // --------------------------------------------------------------------------

  function changeTextCallback(data, eventData, doneChangingTextCallback) {
    model.doneChangingTextCallback = doneChangingTextCallback;
    model.activeToolData = data;
    publicAPI.invokeEditText(data.text);
  }
  // SUPER HACK ---------------------------------------------------------------

  publicAPI.onImageRendered(() => {
    if (model.cornerstoneCanvas) {
      copyCanvas(model.cornerstoneCanvas);
    }
  }, -1);

  // PublicAPI ----------------------------------------------------------------

  publicAPI.setTextValue = (newText) => {
    if (model.activeToolData) {
      model.doneChangingTextCallback(model.activeToolData, newText);
    } else {
      model.doneChangingTextCallback(newText);
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.render = () => {
    if (model.container) {
      cornerstone.updateImage(model.container);
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.activateTool = (toolData) => {
    if (!model.container) {
      return;
    }
    if (model.toolStateManager) {
      const state = model.toolStateManager.toolState.default || {};
      const toolsNames = Object.keys(state);
      for (let i = 0; i < toolsNames.length; i++) {
        const currentToolName = toolsNames[i];
        const toolsData = state[currentToolName].data;
        for (let j = 0; j < toolsData.length; j++) {
          const tool = toolsData[j];
          tool.active = tool === toolData;
        }
      }
      publicAPI.render();
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.deleteTool = (toolData) => {
    if (!model.container) {
      return;
    }
    if (model.toolStateManager) {
      const removeSame = (i) => i !== toolData;
      const state = model.toolStateManager.toolState.default || {};
      const toolsNames = Object.keys(state);
      for (let i = 0; i < toolsNames.length; i++) {
        const currentToolName = toolsNames[i];
        state[currentToolName].data = state[currentToolName].data.filter(
          removeSame
        );
      }
      publicAPI.render();
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.disable = () => {
    if (!model.container) {
      return;
    }

    publicAPI.disableAllTools();
    cornerstone.disable(model.container);
    cornerstoneTools.mouseInput.disable(model.container);
    model.container = null;
  };

  // ----------------------------------------------------------------------------

  publicAPI.enable = (container) => {
    if (model.container) {
      model.container.removeChild(COPY_CANVAS);
      detatchListeners();
      publicAPI.disable();
      // FIXME => may need to store previous state base on viewId + slicePosition?
      model.toolStateManager = null;
    }
    model.cornerstoneCanvas = null;
    model.container = container;
    if (model.container) {
      model.container.appendChild(COPY_CANVAS);
      const { width, height } = model.container.getBoundingClientRect();
      cornerstone.enable(model.container);
      cornerstone.displayImage(
        model.container,
        createEmptyImage(width, height)
      );
      cornerstoneTools.mouseInput.enable(model.container);
      model.toolStateManager = cornerstoneTools.getElementToolStateManager(
        model.container
      );
      attachListeners();

      // Update config
      cornerstoneTools.arrowAnnotate.setConfiguration({
        changeTextCallback,
        getTextCallback,
        drawHandles: true,
        drawHandlesOnHover: true,
        arrowFirst: true,
      });

      // SUPER HACK
      model.cornerstoneCanvas = model.container.querySelector(
        '.cornerstone-canvas'
      );

      publicAPI.render();
    }

    return model.toolStateManager;
  };

  // --------------------------------------------------------------------------

  for (let actionIdx = 0; actionIdx < model.ACTIONS.length; actionIdx++) {
    const action = model.ACTIONS[actionIdx];
    const allTools = [];
    for (let toolIdx = 0; toolIdx < model.TOOLS.length; toolIdx++) {
      const tool = model.TOOLS[toolIdx];
      const toolFn = createToolAction(action, tool);
      publicAPI[`${action}${macro.capitalize(tool)}`] = toolFn;
      allTools.push(toolFn);
    }
    publicAPI[`${action}AllTools`] = macro.chain(...allTools);
  }

  // --------------------------------------------------------------------------
  // SUPER MEGA HACK !!!
  // --------------------------------------------------------------------------
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  ACTIONS: ['enable', 'disable', 'activate', 'deactivate'],
  TOOLS: ['length', 'angle', 'ellipticalRoi', 'arrowAnnotate'],
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  macro.obj(publicAPI, model);
  macro.event(publicAPI, model, 'ImageRendered');
  macro.event(publicAPI, model, 'AnnotationAdded');
  macro.event(publicAPI, model, 'AnnotationModified');
  macro.event(publicAPI, model, 'AnnotationRemoved');
  macro.event(publicAPI, model, 'EditFinished');
  macro.event(publicAPI, model, 'EditText');

  vtkAnnotationManager(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkAnnotationManager');

// ----------------------------------------------------------------------------

const INSTANCE = newInstance();
export default INSTANCE;
