import JSZip from 'jszip';

import macro from '@kitware/vtk.js/macro';
import vtkOBJReader from '@kitware/vtk.js/IO/Misc/OBJReader';
import vtkMTLReader from '@kitware/vtk.js/IO/Misc/MTLReader';

// ----------------------------------------------------------------------------
// vtkGlanceStateReader methods
// ----------------------------------------------------------------------------

let generatedNameCount = 0;

function loadZip(zipContent) {
  const fileContents = { obj: {}, mtl: {}, img: {} };
  const scene = {};
  return new Promise((resolve, reject) => {
    const zip = new JSZip();
    zip
      .loadAsync(zipContent)
      .then(() => {
        let workLoad = 0;

        function done() {
          if (workLoad !== 0) {
            return;
          }
          // Attach images to MTLs
          Object.keys(fileContents.mtl).forEach((mtlFilePath) => {
            const mtlReader = fileContents.mtl[mtlFilePath];
            const basePath = mtlFilePath
              .split('/')
              .filter((v, i, a) => i < a.length - 1)
              .join('/');
            mtlReader.listImages().forEach((relPath) => {
              const key = `${basePath}/${relPath}`;
              const imgSRC = fileContents.img[key];
              if (imgSRC) {
                mtlReader.setImageSrc(relPath, imgSRC);
              }
            });
          });

          // Create pipeline from obj
          Object.keys(fileContents.obj).forEach((objFilePath) => {
            const mtlFilePath = objFilePath.replace(/\.obj$/, '.mtl');
            const objReader = fileContents.obj[objFilePath];
            const mtlReader = fileContents.mtl[mtlFilePath];

            const size = objReader.getNumberOfOutputPorts();
            for (let i = 0; i < size; i++) {
              const dataset = objReader.getOutputData(i);
              const name = dataset.getReferenceByName('name');
              const uid = `${name}__${generatedNameCount++}`;

              scene[uid] = { name, dataset, mtlReader };
            }
          });

          resolve(scene);
        }

        zip.forEach((relativePath, zipEntry) => {
          if (relativePath.match(/\.obj$/i)) {
            workLoad++;
            zipEntry.async('string').then((txt) => {
              const reader = vtkOBJReader.newInstance({ splitMode: 'usemtl' });
              reader.parseAsText(txt);
              fileContents.obj[relativePath] = reader;
              workLoad--;
              done();
            });
          }
          if (relativePath.match(/\.mtl$/i)) {
            workLoad++;
            zipEntry.async('string').then((txt) => {
              const reader = vtkMTLReader.newInstance();
              reader.parseAsText(txt);
              fileContents.mtl[relativePath] = reader;
              workLoad--;
              done();
            });
          }
          if (relativePath.match(/\.jpg$/i) || relativePath.match(/\.png$/i)) {
            workLoad++;
            zipEntry.async('base64').then((txt) => {
              const ext = relativePath.slice(-3).toLowerCase();
              fileContents.img[
                relativePath
              ] = `data:image/${ext};base64,${txt}`;
              workLoad--;
              done();
            });
          }
        });
      })
      .catch(reject);
  });
}

function vtkGlanceZipObjReader(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkGlanceZipObjReader');

  // Returns a promise to signal when image is ready
  publicAPI.parseAsArrayBuffer = (arrayBuffer) => {
    if (!arrayBuffer || arrayBuffer === model.rawDataBuffer) {
      return Promise.resolve(model.appState);
    }

    model.rawDataBuffer = arrayBuffer;

    return loadZip(arrayBuffer).then((scene) => {
      model.scene = scene;
      publicAPI.modified();
      return model.scene;
    });
  };

  publicAPI.requestData = () => {
    publicAPI.parseAsArrayBuffer(model.rawDataBuffer);
  };

  publicAPI.setProxyManager = (proxyManager) => {
    const allViews = proxyManager.getViews();
    Object.keys(model.scene).forEach((uid) => {
      // Create various sources
      const { dataset, mtlReader, name } = model.scene[uid];
      const source = proxyManager.createProxy('Sources', 'TrivialProducer', {
        name: uid,
      });
      source.setInputData(dataset);
      source.activate();
      for (let i = 0; i < allViews.length; i++) {
        const rep = proxyManager.getRepresentation(source, allViews[i]);
        const actor = rep.getActors()[0];
        if (mtlReader && name) {
          mtlReader.applyMaterialToActor(name, actor);
        }
      }
    });
    proxyManager.renderAllViews();
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['scene']);

  // vtkGlanceStateReader methods
  vtkGlanceZipObjReader(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkGlanceZipObjReader');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
