import helper from 'paraview-glance/src/components/core/Datasets/helper';

// ----------------------------------------------------------------------------

function generateSetGet(field) {
  const setMethodName = `set${field}`;
  const getMethodName = `get${field}`;

  function get() {
    let value = null;
    helper.findProxiesWithMethod(this, getMethodName).forEach((proxy) => {
      value = proxy[getMethodName]();
    });
    return value;
  }

  function set() {
    const visibility = !get.apply(this);
    helper.findProxiesWithMethod(this, setMethodName).forEach((proxy) => {
      proxy[setMethodName](visibility);
    });
    this.$forceUpdate();
  }

  return { get, set };
}

// ----------------------------------------------------------------------------

const FIELDS = [
  { name: 'visibility', initialValue: false },
  { name: 'windowLevel', initialValue: 1024 },
  { name: 'windowWidth', initialValue: 2048 },
  { name: 'xSlice', initialValue: -1 },
  { name: 'ySlice', initialValue: -1 },
  { name: 'zSlice', initialValue: -1 },
  { name: 'xSliceVisibility', initialValue: false },
  { name: 'ySliceVisibility', initialValue: false },
  { name: 'zSliceVisibility', initialValue: false },
  { name: 'zSliceVisibility', initialValue: false },
  { name: 'opacity', initialValue: 1.0 },
  // Fake props that don't exist on proxy
  {
    name: 'toggleSliceX',
    computed: generateSetGet('XSliceVisibility'),
  },
  {
    name: 'toggleSliceY',
    computed: generateSetGet('YSliceVisibility'),
  },
  {
    name: 'toggleSliceZ',
    computed: generateSetGet('ZSliceVisibility'),
  },
];

// ----------------------------------------------------------------------------

function isSliceAvailable(name) {
  return !!this.proxyManager
    .getViews()
    .filter((v) => v.getContainer())
    .filter((v) => v.getName() === name).length;
}

// ----------------------------------------------------------------------------

function updateOpacity() {
  // Look on the representations
  const sliceReps = this.proxyManager
    .getRepresentations()
    .filter(
      (r) => r.getInput() === this.source && r.isA('vtkSliceRepresentation')
    );
  for (let i = 0; i < sliceReps.length; i++) {
    const actors = sliceReps[i]
      .getActors()
      .map((actor) => actor.getProperty())
      .filter((property) => property.isA('vtkImageProperty'))
      .forEach((property) => property.setOpacity(this.opacity));
  }
}

// ----------------------------------------------------------------------------

const OPTS = {
  onUpdate: ['updateOpacity'],
  onChange: {
    opacity: 'updateOpacity',
  },
};

// ----------------------------------------------------------------------------
// Add custom method
// ----------------------------------------------------------------------------

const component = helper.generateComponent('SliceControl', FIELDS, true, OPTS);
Object.assign(component.methods, {
  isSliceAvailable,
  updateOpacity,
});

export default component;
