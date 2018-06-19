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
  { name: 'colorLevel', initialValue: 1024 },
  { name: 'colorWindow', initialValue: 2048 },
  { name: 'xSlice', initialValue: -1 },
  { name: 'ySlice', initialValue: -1 },
  { name: 'zSlice', initialValue: -1 },
  { name: 'xSliceVisibility', initialValue: false },
  { name: 'ySliceVisibility', initialValue: false },
  { name: 'zSliceVisibility', initialValue: false },
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
    .filter((v) => v.getReferenceByName('name') === name).length;
}

// ----------------------------------------------------------------------------
// Add custom method
// ----------------------------------------------------------------------------

const component = helper.generateComponent(FIELDS, true, {
  onChange: {
    visibility: '$forceUpdate',
  },
});
Object.assign(component.methods, {
  isSliceAvailable,
});

export default component;
