import macro from 'vtk.js/Sources/macro';

import * as cornerstone from 'cornerstone-core';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneTools from 'cornerstone-tools';

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

global.cornerstoneTools = cornerstoneTools;

const ACTIONS = ['enable', 'disable', 'activate', 'deactivate'];
const TOOLS = ['length', 'angle', 'ellipticalRoi'];

let currentContainer = null;
const publicAPI = {};

/*
imageId - the imageId associated with this image object
minPixelValue - the minimum stored pixel value in the image
maxPixelValue - the maximum stored pixel value in the image
slope - the rescale slope to convert stored pixel values to modality pixel values or 1 if not specified
intercept - the rescale intercept used to convert stored pixel values to modality values or 0 if not specified
windowCenter - the default windowCenter to apply to the image
windowWidth - the default windowWidth to apply to the image
getPixelData - a function that returns the underlying pixel data. An array of integers for grayscale and an array of RGBA for color
getImageData - a function that returns a canvas imageData object for the image. This is only needed for color images
getCanvas - a function that returns a canvas element with the image loaded into it. This is only needed for color images.
getImage - a function that returns a JavaScript Image object with the image data. This is optional and typically used for images encoded in standard web JPEG and PNG formats
rows - number of rows in the image. This is the same as height but duplicated for convenience
columns - number of columns in the image. This is the same as width but duplicated for convenience
height - the height of the mage. This is the same as rows but duplicated for convenience
width - the width of the image. This is the same as columns but duplicated for convenience
color - true if pixel data is RGB, false if grayscale
columnPixelSpacing - horizontal distance between the middle of each pixel (or width of each pixel) in mm or undefined if not known
rowPixelSpacing - vertical distance between the middle of each pixel (or heigh of each pixel) in mm or undefined if not known
invert - true if the the image should initially be displayed be inverted, false if not. This is here mainly to support DICOM images with a photometric interpretation of MONOCHROME1
sizeInBytes - the number of bytes used to store the pixels for this image.
*/

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

function createImageFromCanvas(canvas, imageId = 'canvas') {
  const { width, height } = canvas;
  return {
    imageId,
    minPixelValue: 0,
    maxPixelValue: 255,
    slope: 1,
    intercept: 0,
    windowCenter: 128,
    windowWidth: 255,
    getCanvas() {
      return canvas;
    },
    rows: height,
    columns: width,
    height,
    width,
    color: true,
    columnPixelSpacing: undefined,
    rowPixelSpacing: undefined,
    invert: false,
    sizeInBytes: width * height * 4,
    rgba: false,
  };
}

// ----------------------------------------------------------------------------

function disable() {
  console.log('disable');
  publicAPI.disableAllTools();
  cornerstone.disable(currentContainer);
  cornerstoneTools.mouseInput.disable(currentContainer);

  currentContainer = null;
}

// ----------------------------------------------------------------------------

function enable(container, canvas) {
  if (currentContainer) {
    disable();
  }
  currentContainer = container;
  if (currentContainer) {
    const { width, height } = currentContainer.getBoundingClientRect();
    cornerstone.enable(currentContainer);
    cornerstone.displayImage(
      currentContainer,
      canvas ? createImageFromCanvas(canvas) : createEmptyImage(width, height)
    );
    cornerstoneTools.mouseInput.enable(currentContainer);
  }
}

// ----------------------------------------------------------------------------

function createToolAction(action, toolName) {
  return (...args) => {
    console.log(`cornerstoneTools.${toolName}.${action}(${args.join(', ')})`);
    cornerstoneTools[toolName][action](currentContainer, ...args);
  };
}

// ----------------------------------------------------------------------------
// Expose API
// ----------------------------------------------------------------------------

Object.assign(publicAPI, { enable, disable });

for (let actionIdx = 0; actionIdx < ACTIONS.length; actionIdx++) {
  const action = ACTIONS[actionIdx];
  const allTools = [];
  for (let toolIdx = 0; toolIdx < TOOLS.length; toolIdx++) {
    const tool = TOOLS[toolIdx];
    const toolFn = createToolAction(action, tool);
    publicAPI[`${action}${macro.capitalize(tool)}`] = toolFn;
    allTools.push(toolFn);
  }
  publicAPI[`${action}AllTools`] = macro.chain(...allTools);
}

export default publicAPI;

// ----------------------------------------------------------------------------
// FIXME - debug / test
// ----------------------------------------------------------------------------

// image.src = exampleImageId;
// image.addEventListener('load', () => {
//   console.log('update canvas...');
//   canvas.width = image.width;
//   canvas.height = image.height;
//   canvas.getContext('2d').drawImage(image, 0, 0);

//   if (currentWorkspace) {
//     enable();
//   }
// });
