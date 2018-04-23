import macro from 'vtk.js/Sources/macro';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';

import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

import { GLANCE_DATA } from './Constants';

const { vtkErrorMacro } = macro;

const BLANK_IMAGE = {
  imageId: 'DUMMY',
  minPixelValue: 0,
  maxPixelValue: 1,
  slope: 0,
  intercept: 0,
  rows: 1,
  height: 1,
  columns: 1,
  width: 1,
  rowPixelSpacing: 1,
  columnPixelSpacing: 1,
  getPixelData: () => new Uint8Array([0]),
  sizeInBytes: 1,
};

function CornerstoneRenderer(publicAPI, model) {
  model.classHierarchy.push('vtkCornerstoneRenderer');

  // Private ------------------------------------------------------------------

  function resetRenderer() {
    if (!model.container) {
      return;
    }

    if (model.representation) {
      // store current representation on cornerstone element
      cornerstone.getElementData(
        model.container,
        GLANCE_DATA
      ).currentRepresentation =
        model.representation;

      // do a first render with a viewport reset
      publicAPI.render(true);

      if (model.toolManager) {
        model.toolManager.setupElement(model.container);
      }
    } else {
      publicAPI.renderBlankImage();
      if (model.toolManager) {
        model.toolManager.teardownElement(model.container);
      }
      cornerstone.removeElementData(model.container, GLANCE_DATA);
    }
  }

  // Setup --------------------------------------------------------------------

  let repSubscription = null;
  model.rotateAngle = 0;

  // Public -------------------------------------------------------------------

  publicAPI.render = (resetViewport = false) => {
    if (!model.container || !model.representation) {
      return;
    }

    const imageStack = model.representation.getImageStack();
    if (!imageStack) {
      return;
    }

    const imageId = imageStack.imageIds[imageStack.currentImageIdIndex];

    let promise;
    try {
      promise = cornerstone.loadAndCacheImage(imageId);
    } catch (error) {
      vtkErrorMacro(String(error));
      return;
    }

    promise
      .then((image) => {
        const viewport = Object.assign(
          {},
          cornerstone.getViewport(model.container)
        );

        if (resetViewport) {
          Object.assign(
            viewport,
            cornerstone.getDefaultViewportForImage(model.container, image)
          );
        }

        Object.assign(viewport, {
          voi: {
            windowWidth: model.representation.getColorWindow(),
            windowCenter: model.representation.getColorLevel(),
          },
          hflip: model.representation.getHFlip(),
          vflip: model.representation.getVFlip(),
          pixelReplication: !model.representation.getInterpolation(),
          invert: model.representation.getInvertColors(),
          rotation: model.rotateAngle,
        });

        cornerstone.displayImage(model.container, image, viewport);
      })
      .catch((error) => vtkErrorMacro(String(error)));
  };

  publicAPI.renderLater = () => setTimeout(publicAPI.render, 0);

  publicAPI.renderBlankImage = () => {
    if (!model.container) {
      return;
    }
    cornerstone.displayImage(model.container, BLANK_IMAGE);
  };

  publicAPI.setRepresentation = (representation) => {
    if (model.representation === representation) {
      return;
    }

    if (model.representation && repSubscription) {
      repSubscription.unsubscribe();
      repSubscription = null;
    }

    model.representation = representation;

    // purge cornerstone cache whenever we switch images
    cornerstone.imageCache.purgeCache();

    if (representation) {
      repSubscription = representation.onModified(publicAPI.renderLater);
    }

    resetRenderer();
  };

  publicAPI.setContainer = (container) => {
    if (model.container === container) {
      return;
    }

    if (model.container) {
      cornerstone.disable(model.container);
    }

    model.container = container;

    if (container) {
      cornerstone.enable(container);
      cornerstoneTools.makeUnselectable(container);
    }

    resetRenderer();
  };

  publicAPI.resize = () => {
    if (model.container) {
      cornerstone.resize(model.container);
    }
  };

  publicAPI.resetViewport = () => publicAPI.render(true);

  publicAPI.captureImage = (format = 'image/png') => {
    if (model.container) {
      const canvas = model.container.querySelector('canvas');
      if (canvas) {
        return canvas.toDataURL(format);
      }
    }
    return null;
  };

  publicAPI.rotate = (angle = 90) => {
    model.rotateAngle = (model.rotateAngle + angle) % 360;
    publicAPI.renderLater();
  };
}

function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, initialValues);

  vtkRenderer.extend(publicAPI, model);
  macro.get(publicAPI, model, ['container', 'representation']);
  macro.setGet(publicAPI, model, ['toolManager']);

  CornerstoneRenderer(publicAPI, model);
}

export const newInstance = macro.newInstance(extend, 'vtkCornerstoneRenderer');

export default { newInstance, extend };
