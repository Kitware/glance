import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper';
import DataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper';
import macro from '@kitware/vtk.js/macro';
import vtkHttpSceneLoader from '@kitware/vtk.js/IO/Core/HttpSceneLoader';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';

// Can't import both "Mode" objects directly.
import LookupTableProxyConstants from '@kitware/vtk.js/Proxy/Core/LookupTableProxy/Constants';
import PiecewiseFunctionProxyConstants from '@kitware/vtk.js/Proxy/Core/PiecewiseFunctionProxy/Constants';

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
          startLODLoaders: false,
        });
        sceneImporter.setUrl('index.json');
        sceneImporter.onReady(() => {
          // We need to wait for all DataSet to finish loading
          if (++dsCount === sceneImporter.getScene().length) {
            const response = { ...sceneImporter.getMetadata() };
            response.scene = sceneImporter.getScene();
            response.animationHandler = sceneImporter.getAnimationHandler();
            resolve(response);
          }
        });
      },
    });
  });
}

// ----------------------------------------------------------------------------
/* eslint-disable no-param-reassign */
// ----------------------------------------------------------------------------

function updateRanges(container, name, dataRange) {
  if (!container[name]) {
    container[name] = dataRange.slice();
  } else {
    container[name][0] = Math.min(container[name][0], dataRange[0]);
    container[name][1] = Math.max(container[name][1], dataRange[1]);
  }

  return container;
}

// ----------------------------------------------------------------------------

function gatherRanges(container, dataset) {
  const fn = (array) =>
    updateRanges(container, array.getName(), array.getRange(-1));
  dataset.getPointData().getArrays().forEach(fn);
  dataset.getCellData().getArrays().forEach(fn);
}

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
      ({
        scene,
        camera,
        background,
        lookupTables,
        cameraViewPoints,
        animationHandler,
      }) => {
        model.scene = scene;
        model.camera = camera;
        model.background = background;
        model.lookupTables = lookupTables;
        model.cameraViewPoints = cameraViewPoints;
        model.animationHandler = animationHandler;
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
    const allDataRanges = {};
    model.scene.forEach((sceneItem) => {
      const { source, mapper, actor, volume, name, volumeComponents } =
        sceneItem;
      const actorState = actor ? actor.get('origin', 'scale', 'position') : {};
      const volumeState = volume
        ? volume.get('origin', 'scale', 'position')
        : {};

      const propState = actor
        ? actor
            .getProperty()
            .get(
              'representation',
              'edgeVisibility',
              'diffuseColor',
              'pointSize',
              'opacity'
            )
        : {};

      const volumePropState = volume
        ? volume
            .getProperty()
            .get('interpolationType', 'independantComponents', 'shade')
        : {};

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
      sourceProxy.activate();

      // Gather the range for each fields
      gatherRanges(allDataRanges, source.getOutputData());

      for (let i = 0; i < allViews.length; i++) {
        const view = allViews[i];
        const rep = proxyManager.getRepresentation(sourceProxy, allViews[i]);
        rep.setRescaleOnColorBy(false);
        if (actor) {
          const actorFromRep = rep.getActors()[0];
          if (actorFromRep) {
            actorFromRep.set(actorState);
            actorFromRep.getProperty().set(propState);
            actorFromRep.getMapper().set(mapperState);

            // Add textures back
            actor.getTextures().forEach((t) => {
              actorFromRep.addTexture(t);
            });
          }
        }

        if (volume) {
          const volumeFromRep = rep.getVolumes()[0];
          if (volumeFromRep) {
            volumeFromRep.set(volumeState);
            volumeFromRep.getProperty().set(volumePropState);
          }
        }

        // Use representation API to set active array
        let arrayLocation = 'pointData';
        if (
          mapperState.scalarMode === vtkMapper.ScalarMode.USE_CELL_FIELD_DATA
        ) {
          arrayLocation = 'cellData';
        }
        rep.setColorBy(mapperState.colorByArrayName, arrayLocation);

        // Update camera if 3d view
        if (view.getName() === 'default') {
          view.getCamera().set(model.camera);
          if (model.animationHandler) {
            model.animationHandler.addRenderer(view.getRenderer());
          }
        }

        if (volumeComponents) {
          const [colorByName] = rep.getColorBy();
          const [{ rgbTransferFunction, scalarOpacity }] = volumeComponents;
          const lutProxy = rep.getLookupTableProxy(colorByName);
          const pwfProxy = rep.getPiecewiseFunctionProxy(colorByName);
          if (rgbTransferFunction) {
            // Push state data into lookup table
            lutProxy.setPresetName('-');
            const [min, max] = rgbTransferFunction.getMappingRange();
            lutProxy.setDataRange(min, max);
            lutProxy.setMode(LookupTableProxyConstants.Mode.Nodes);
            lutProxy
              .getLookupTable()
              .setColorSpace(rgbTransferFunction.getColorSpace());
            lutProxy.setNodes(rgbTransferFunction.get('nodes').nodes);
          }
          if (scalarOpacity) {
            const pwf = pwfProxy.getPiecewiseFunction();
            pwf.setClamping(scalarOpacity.getClamping());
            const nodes = [];

            const range = scalarOpacity.getRange();
            pwfProxy.setDataRange(...range);

            const width = range[1] - range[0];

            for (
              let nodeIdx = 0;
              nodeIdx < scalarOpacity.getSize();
              ++nodeIdx
            ) {
              const node = [];
              scalarOpacity.getNodeValue(nodeIdx, node);
              const [x, y, midpoint, sharpness] = node;
              // x needs to be normalized
              nodes.push({ x: (x - range[0]) / width, y, midpoint, sharpness });
            }
            pwfProxy.setMode(PiecewiseFunctionProxyConstants.Mode.Nodes);
            pwfProxy.setNodes(nodes);
          }
        }
      }

      const { textureLODsDownloader } = sceneItem;
      if (textureLODsDownloader) {
        // Trigger re-renders when new textures are downloaded
        textureLODsDownloader.setStepFinishedCallback(
          proxyManager.renderAllViews
        );

        const maxTextureLODSize =
          proxyManager.getReferenceByName('$store').state.views
            .maxTextureLODSize;
        textureLODsDownloader.setMaxTextureLODSize(maxTextureLODSize);

        // Start the downloads
        textureLODsDownloader.startDownloads();
      }

      const { dataSetLODsLoader } = sceneItem;
      if (dataSetLODsLoader) {
        const callback = () => {
          // We must set the new source on the proxy to get paraview
          // glance to update.
          const newSource = dataSetLODsLoader.getCurrentSource();
          sourceProxy.setInputAlgorithm(
            newSource,
            newSource.getOutputData().getClassName()
          );
        };
        dataSetLODsLoader.setStepFinishedCallback(callback);

        // Start the downloads
        dataSetLODsLoader.startDownloads();
      }
      if (model.animationHandler) {
        if (proxyManager.getProxyInGroup('AnimationManager').length) {
          // Find an existing animation manager
          const animationManager =
            proxyManager.getProxyInGroup('AnimationManager')[0];

          const animation = proxyManager.createProxy(
            'Animations',
            'TimeStepAnimation'
          );

          animation.setInputAnimationHandler(model.animationHandler);
          animationManager.addAnimation(animation);

          animationManager.onCurrentFrameChanged(() =>
            proxyManager.renderAllViews()
          );
        }
      }
    });

    // Create LookupTable for each field with max range
    Object.keys(allDataRanges).forEach((fieldName) => {
      const lutProxy = proxyManager.getLookupTable(fieldName);
      lutProxy.setDataRange(...allDataRanges[fieldName]);
    });

    // Update LookupTables with PV ranges
    Object.keys(model.lookupTables || {}).forEach((fieldName) => {
      const lutState = model.lookupTables[fieldName];
      const lutProxy = proxyManager.getLookupTable(fieldName);
      const lut = lutProxy.getLookupTable();

      // Push state data into lookup table
      const min = lutState.nodes[0][0];
      const max = lutState.nodes[lutState.nodes.length - 1][0];
      lutProxy.setPresetName('-');
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
  macro.get(publicAPI, model, [
    'scene',
    'camera',
    'background',
    'cameraViewPoints',
  ]);

  // vtkGlanceStateReader methods
  vtkGlanceVtkJsReader(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkGlanceVtkJsReader');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
