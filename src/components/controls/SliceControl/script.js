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

function generateSetGetSliceDomain(name) {
  return {
    set() {},
    get() {
      const domain = { ...this.domains[name] };
      if (domain && 'min' in domain && 'max' in domain) {
        domain.min = Math.floor(domain.min);
        domain.max = Math.floor(domain.max);
      }
      return domain;
    },
  };
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
  { name: 'opacity', initialValue: 1.0 },
  {
    name: 'xSliceDomain',
    computed: generateSetGetSliceDomain('xSlice'),
  },
  {
    name: 'ySliceDomain',
    computed: generateSetGetSliceDomain('ySlice'),
  },
  {
    name: 'zSliceDomain',
    computed: generateSetGetSliceDomain('zSlice'),
  },
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
  return !!this.$proxyManager
    .getViews()
    .filter((v) => v.getContainer())
    .filter((v) => v.getName() === name).length;
}

// ----------------------------------------------------------------------------

const OPTS = {};

// ----------------------------------------------------------------------------
// Add custom method
// ----------------------------------------------------------------------------

const component = helper.generateComponent('SliceControl', FIELDS, true, OPTS);
Object.assign(component.methods, {
  isSliceAvailable,
});

export default component;
