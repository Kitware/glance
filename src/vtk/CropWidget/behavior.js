import macro from 'vtk.js/Sources/macro';

export default function widgetBehavior(publicAPI, model) {
  model.classHierarchy.push('vtkCropWidgetProp');
  let cameraSub = null;

  // --------------------------------------------------------------------------

  publicAPI.delete = macro.chain(publicAPI.delete, () => {
    if (cameraSub) {
      cameraSub.unsubscribe();
    }
  });

  // --------------------------------------------------------------------------
  // init
  // --------------------------------------------------------------------------

  // set outline representation lighting
  model.representations
    .filter((rep) => rep.isA('vtkOutlineContextRepresentation'))
    .forEach((rep) =>
      rep
        .getActor()
        .getProperty()
        .set({ ambient: 1, diffuse: 0 })
    );

  // override the default handle scale
  model.widgetState
    .getAllNestedStates()
    .filter((state) => !!state.setScale1)
    .forEach((state) => state.setScale1(0.075));

  const setHandleScaleFromCamera = () => {
    let scale;
    if (model.camera.getParallelProjection()) {
      scale = model.camera.getParallelScale() / 1.25;
    } else {
      scale = model.camera.getDistance() / 6;
    }

    publicAPI.setHandleScale(scale);
  };

  // listen to camera so we can scale the handles to the screen
  cameraSub = model.camera.onModified(setHandleScaleFromCamera);
  // since forwarded/linked set/get methods aren't created until
  // after this behavior function finishes, this is a hack to invoke
  // initial handle scale.
  setTimeout(setHandleScaleFromCamera, 0);
}
