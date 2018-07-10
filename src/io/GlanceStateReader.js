import JSZip from 'jszip';

import macro from 'vtk.js/Sources/macro';

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
      return Promise.resolve();
    }

    model.rawDataBuffer = arrayBuffer;

    return loadState(arrayBuffer).then((state) => {
      model.appState = state;
      publicAPI.modified();
    });
  };

  // Loads any remote datasets that are referenced with a "url" key
  // downloadFunc should resolve with a vtkDataSet given a url and name
  publicAPI.loadRemoteDatasets = (downloadFunc) => {
    if (model.appState && model.appState.sources) {
      const promises = model.appState.sources
        .filter((source) => source.props.url)
        .map((source) =>
          downloadFunc(source.props.name, source.props.url).then((dataset) => {
            // eslint-disable-next-line no-param-reassign
            source.props.dataset = dataset.getState();
          })
        );
      return Promise.all(promises);
    }
    return Promise.resolve([]);
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
