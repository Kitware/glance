export default function widgetBehavior(publicAPI, model) {
  model.classHierarchy.push('vtkCropWidgetProp');

  // --------------------------------------------------------------------------
  // init
  // --------------------------------------------------------------------------

  // set outline representation lighting
  model.representations
    .filter((rep) => rep.isA('vtkOutlineContextRepresentation'))
    .forEach((rep) =>
      rep.getActor().getProperty().set({ ambient: 1, diffuse: 0 })
    );

  // override the default handle scale
  model.widgetState
    .getAllNestedStates()
    .filter((state) => !!state.setScale1)
    .forEach((state) => state.setScale1(20));
}
