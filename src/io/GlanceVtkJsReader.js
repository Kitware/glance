import DataAccessHelper from 'vtk.js/Sources/IO/Core/DataAccessHelper';
import macro from 'vtk.js/Sources/macro';
import vtkHttpSceneLoader from 'vtk.js/Sources/IO/Core/HttpSceneLoader';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';

// ----------------------------------------------------------------------------
// vtkGlanceVtkJsReader methods
// ----------------------------------------------------------------------------

function loadZip(zipContent) {
  return new Promise((resolve) => {
    let dsCount = 0;
    const dataAccessHelper = DataAccessHelper.get('zip', {
      zipContent,
      callback() {
        const sceneImporter = vtkHttpSceneLoader.newInstance({
          dataAccessHelper,
        });
        sceneImporter.setUrl('index.json');
        sceneImporter.onReady(() => {
          // We need to wait for all DataSet to finish loading
          if (++dsCount === sceneImporter.getScene().length) {
            const response = Object.assign({}, sceneImporter.getMetadata());
            response.scene = sceneImporter.getScene();
            console.log(response);
            resolve(response);
          }
        });
      },
    });
  });
}

// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------

function vtkGlanceVtkJsReader(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkGlanceVtkJsReader');

  // Returns a promise to signal when image is ready
  publicAPI.parseAsArrayBuffer = (arrayBuffer) => {
    if (!arrayBuffer || arrayBuffer === model.rawDataBuffer) {
      return Promise.resolve(model.appState);
    }

    model.rawDataBuffer = arrayBuffer;

    return loadZip(arrayBuffer).then(
      ({ scene, camera, background, lookupTables }) => {
        model.scene = scene;
        model.camera = camera;
        model.background = background;
        model.lookupTables = lookupTables;
        publicAPI.modified();
        return model.scene;
      }
    );
  };

  publicAPI.requestData = () => {
    publicAPI.parseAsArrayBuffer(model.rawDataBuffer);
  };

  publicAPI.setProxyManager = (proxyManager) => {
    const allViews = proxyManager.getViews();
    model.scene.forEach(({ source, mapper, actor, name }) => {
      const actorState = actor.get('origin', 'scale', 'position');
      const propState = actor
        .getProperty()
        .get(
          'representation',
          'edgeVisibility',
          'diffuseColor',
          'pointSize',
          'opacity'
        );
      const mapperState = mapper.get(
        'colorByArrayName',
        'colorMode',
        'scalarMode'
      );
      // Create various sources
      const sourceProxy = proxyManager.createProxy(
        'Sources',
        'TrivialProducer',
        {
          name,
        }
      );
      sourceProxy.setInputAlgorithm(
        source,
        source.getOutputData().getClassName()
      );
      for (let i = 0; i < allViews.length; i++) {
        const view = allViews[i];
        const rep = proxyManager.getRepresentation(sourceProxy, allViews[i]);
        const actorFromRep = rep.getActors()[0];
        actorFromRep.set(actorState);
        actorFromRep.getProperty().set(propState);
        actorFromRep.getMapper().set(mapperState);

        // Use representation API to set active array
        let arrayLocation = 'pointData';
        if (
          mapperState.scalarMode === vtkMapper.ScalarMode.USE_CELL_FIELD_DATA
        ) {
          arrayLocation = 'cellData';
        }
        rep.setColorBy(mapperState.colorByArrayName, arrayLocation);

        // Add textures back
        actor.getTextures().forEach((t) => {
          actorFromRep.addTexture(t);
        });

        // Update camera if 3d view
        if (view.getName() === 'default') {
          view.getCamera().set(model.camera);
        }
      }
    });

    // Update LookupTables
    Object.keys(model.lookupTables).forEach((fieldName) => {
      const lutState = model.lookupTables[fieldName];
      const lutProxy = proxyManager.getLookupTable(fieldName);
      const lut = lutProxy.getLookupTable();

      // Push state data into lookup table
      const min = lutState.nodes[0][0];
      const max = lutState.nodes[lutState.nodes.length - 1][0];
      lutProxy.setDataRange(min, max);
      lutProxy.setMode(3); // use nodes
      lut.setColorSpace(lutState.colorSpace);
      lutProxy.setNodes(
        lutState.nodes.map(([x, r, g, b, midpoint, sharpness]) => ({
          x,
          r,
          g,
          b,
          midpoint,
          sharpness,
        }))
      );
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
  macro.get(publicAPI, model, ['scene', 'camera', 'background']);

  // vtkGlanceStateReader methods
  vtkGlanceVtkJsReader(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkGlanceVtkJsReader');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
