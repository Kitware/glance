import JSZip from 'jszip';

import macro from '@kitware/vtk.js/macro';

// ----------------------------------------------------------------------------
// vtkGlanceStateReader methods
// ----------------------------------------------------------------------------

function loadState(file) {
  return new Promise((resolve, reject) => {
    const zip = new JSZip();
    zip
      .loadAsync(file)
      .then(() => {
        zip.forEach((relativePath, zipEntry) => {
          if (relativePath.match(/state\.json$/i)) {
            zipEntry
              .async('string')
              .then((txt) => {
                resolve(JSON.parse(txt));
              })
              .catch(reject);
          }
        });
      })
      .catch(reject);
  });
}

function vtkGlanceStateReader(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkGlanceStateReader');

  model.appState = null;

  // Returns a promise to signal when image is ready
  publicAPI.parseAsArrayBuffer = (arrayBuffer) => {
    if (!arrayBuffer || arrayBuffer === model.rawDataBuffer) {
      return Promise.resolve(model.appState);
    }

    model.rawDataBuffer = arrayBuffer;

    return loadState(arrayBuffer).then((state) => {
      model.appState = state;
      publicAPI.modified();
      return model.appState;
    });
  };

  publicAPI.requestData = () => {
    publicAPI.parseAsArrayBuffer(model.rawDataBuffer);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);
  macro.algo(publicAPI, model, 0, 1);
  macro.get(publicAPI, model, ['appState']);

  // vtkGlanceStateReader methods
  vtkGlanceStateReader(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkGlanceStateReader');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
