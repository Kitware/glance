import macro from 'vtk.js/Sources/macro';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';

import * as cornerstone from 'cornerstone-core';

const { vtkErrorMacro } = macro;

function CornerstoneRenderer(publicAPI, model) {
  model.classHierarchy.push('vtkCornerstoneRenderer');

  // Private ------------------------------------------------------------------

  function resetRenderer() {
    if (!model.container) {
      return;
    }

    if (model.representation) {
      // do a first render with a viewport reset
      publicAPI.render();

      if (model.toolManager) {
        model.toolManager.setupElement(model.container);
      }
    } else {
      if (model.toolManager) {
        model.toolManager.teardownElement(model.container);
      }
    }
  }

  // Setup --------------------------------------------------------------------

  let repSubscription = null;

  // Public -------------------------------------------------------------------

  publicAPI.render = () => {
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
          cornerstone.getViewport(model.container),
          {
            voi: {
              windowWidth: model.representation.getColorWindow(),
              windowCenter: model.representation.getColorLevel(),
            },
            vflip: true,
          }
        );
        cornerstone.displayImage(model.container, image, viewport);
      })
      .catch((error) => vtkErrorMacro(String(error)));
  };

  publicAPI.renderLater = () => setTimeout(publicAPI.render, 0);

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
    }

    resetRenderer();
  };

  publicAPI.resize = () => {
    if (model.container) {
      cornerstone.resize(model.container);
    }
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
