import helper from 'paraview-glance/src/components/core/Datasets/helper';

const FIELDS = [
  { name: 'visibility', initialValue: false },
  { name: 'colorLevel', initialValue: 1024 },
  { name: 'colorWindow', initialValue: 2048 },
  { name: 'xSlice', initialValue: -1 },
  { name: 'ySlice', initialValue: -1 },
  { name: 'zSlice', initialValue: -1 },
  { name: 'sliceVisibility', initialValue: false },
];

// ----------------------------------------------------------------------------

function isSliceAvailable(name) {
  return !!this.proxyManager
    .getViews()
    .filter((v) => v.getContainer())
    .filter((v) => v.getReferenceByName('name') === name).length;
}

// ----------------------------------------------------------------------------

function updateCornerAnnotation() {
  const views = this.proxyManager.getViews().filter((v) => v.getContainer());
  for (let i = 0; i < views.length; i++) {
    const view = views[i];
    const representations = view
      .getRepresentations()
      .filter((r) => r.getInput() === this.source);
    const annotations = {
      colorWindow: '(none)',
      colorLevel: '(none)',
    };
    while (representations.length) {
      const representation = representations.pop();
      if (representation.getColorWindow) {
        annotations.colorWindow = Math.round(representation.getColorWindow());
      }
      if (representation.getColorLevel) {
        annotations.colorLevel = Math.round(representation.getColorLevel());
      }
      if (representation.getSlice) {
        annotations.slice = Number(representation.getSlice()).toFixed(2);
      }
    }
    view.updateCornerAnnotation(annotations);
  }
}

// ----------------------------------------------------------------------------
// Add custom method
// ----------------------------------------------------------------------------

const component = helper.generateComponent(FIELDS, true, {
  onChange: {
    xSlice: 'updateCornerAnnotation',
    ySlice: 'updateCornerAnnotation',
    zSlice: 'updateCornerAnnotation',
    colorWindow: 'updateCornerAnnotation',
    colorLevel: 'updateCornerAnnotation',
  },
});
Object.assign(component.methods, {
  isSliceAvailable,
  updateCornerAnnotation,
});

export default component;
