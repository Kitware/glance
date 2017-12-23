import macro                          from 'vtk.js/Sources/macro';
import vtkInteractorStyleManipulator  from 'vtk.js/Sources/Interaction/Style/InteractorStyleManipulator';
import vtkOpenGLRenderWindow          from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderer                    from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkRenderWindow                from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor      from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkTrackballPan                from 'vtk.js/Sources/Interaction/Manipulators/TrackballPan';
import vtkTrackballRoll               from 'vtk.js/Sources/Interaction/Manipulators/TrackballRoll';
import vtkTrackballRotate             from 'vtk.js/Sources/Interaction/Manipulators/TrackballRotate';
import vtkTrackballZoom               from 'vtk.js/Sources/Interaction/Manipulators/TrackballZoom';

// ----------------------------------------------------------------------------
// vtkView methods
// ----------------------------------------------------------------------------

function vtkView(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkView');
  model.ui = [];

  // Setup --------------------------------------------------------------------
  model.renderWindow = vtkRenderWindow.newInstance();
  model.renderer = vtkRenderer.newInstance({ background: [0, 0, 0] });
  model.renderWindow.addRenderer(model.renderer);

  model.openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
  model.renderWindow.addView(model.openglRenderWindow);

  model.interactor = vtkRenderWindowInteractor.newInstance();
  model.interactor.setView(model.openglRenderWindow);

  model.interactorStyle3D = vtkInteractorStyleManipulator.newInstance();
  model.interactorStyle2D = vtkInteractorStyleManipulator.newInstance();

  // Rotate
  model.interactorStyle3D.addManipulator(vtkTrackballRotate.newInstance());
  // Pan
  model.interactorStyle2D.addManipulator(vtkTrackballPan.newInstance());
  model.interactorStyle2D.addManipulator(vtkTrackballPan.newInstance({ shift: true }));
  model.interactorStyle3D.addManipulator(vtkTrackballPan.newInstance({ shift: true }));
  // Zoom
  model.interactorStyle2D.addManipulator(vtkTrackballZoom.newInstance({ control: true }));
  model.interactorStyle2D.addManipulator(vtkTrackballZoom.newInstance({ alt: true }));
  model.interactorStyle3D.addManipulator(vtkTrackballZoom.newInstance({ control: true }));
  model.interactorStyle3D.addManipulator(vtkTrackballZoom.newInstance({ alt: true }));
  // Roll
  model.interactorStyle3D.addManipulator(vtkTrackballRoll.newInstance({ shift: true, control: true }));
  model.interactorStyle3D.addManipulator(vtkTrackballRoll.newInstance({ shift: true, alt: true }));

  // Setup interaction
  model.interactor.setInteractorStyle(model.useParallelRendering ? model.interactorStyle2D : model.interactorStyle3D);
  model.camera = model.renderer.getActiveCamera();
  model.camera.setParallelProjection(!!model.useParallelRendering);

  // API ----------------------------------------------------------------------

  publicAPI.setContainer = (container) => {
    if (model.container) {
      model.interactor.unbindEvents(model.container);
      model.openglRenderWindow.setContainer(null);
    }

    model.container = container;

    if (container) {
      model.openglRenderWindow.setContainer(container);
      model.interactor.initialize();
      model.interactor.bindEvents(container);
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.resize = () => {
    if (model.container) {
      const dims = model.container.getBoundingClientRect();
      model.openglRenderWindow.setSize(Math.max(10, Math.floor(dims.width)), Math.max(10, Math.floor(dims.height)));
      publicAPI.renderLater();
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.renderLater = () => {
    setTimeout(model.renderWindow.render, 0);
  };

  // --------------------------------------------------------------------------

  publicAPI.addRepresentation = (representation) => {
    if (!representation) {
      return;
    }
    if (model.representations.indexOf(representation) === -1) {
      model.representations.push(representation);
      representation.getActors().forEach(model.renderer.addActor);
      representation.getVolumes().forEach(model.renderer.addVolume);
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.removeRepresentation = (representation) => {
    if (!representation) {
      return;
    }
    if (model.representations.indexOf(representation) !== -1) {
      model.representations = model.representations.filter(r => r !== representation);
      representation.getActors().forEach(model.renderer.removeActor);
      representation.getVolumes().forEach(model.renderer.removeVolume);
    }
  };


  // --------------------------------------------------------------------------

  publicAPI.isVisible = (sourceId) => {
    const rep = model.representations.find(r => r.isSourceRepresentation(sourceId));
    if (rep) {
      return rep.isVisible();
    }
    return false;
  };

  // --------------------------------------------------------------------------

  publicAPI.resetCamera = () => {
    model.renderer.resetCamera();
    model.renderer.resetCameraClippingRange();
    model.interactorStyle2D.setCenterOfRotation(model.camera.getFocalPoint());
    model.interactorStyle3D.setCenterOfRotation(model.camera.getFocalPoint());
    publicAPI.renderLater();
  };

  // --------------------------------------------------------------------------

  publicAPI.captureImage = () => model.renderWindow.captureImages()[0];
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  representations: [],
  sectionName: 'view',
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, [
    'representations',
    'renderer',
    'renderWindow',
    'openglRenderWindow',
    'interactor',
    'interactorStyle2D',
    'interactorStyle3D',
    'container',
    'useParallelRendering',
    'camera',
  ]);

  // Object specific methods
  vtkView(publicAPI, model);
}

// ----------------------------------------------------------------------------

export default { extend };
