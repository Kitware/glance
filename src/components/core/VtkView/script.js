import {
  DEFAULT_VIEW_TYPE,
  VIEW_TYPES,
  VIEW_ORIENTATIONS,
} from 'paraview-glance/src/components/core/VtkView/constants';

// ----------------------------------------------------------------------------
// Component methods
// ----------------------------------------------------------------------------

function getView(type, name) {
  if (this.view) {
    this.view.setContainer(null);
  }

  this.view = null;
  const views = this.proxyManager.getViews();
  for (let i = 0; i < views.length; i++) {
    if (views[i].getProxyName() === type) {
      if (name) {
        if (views[i].getReferenceByName('name') === name) {
          this.view = views[i];
        }
      } else {
        this.view = views[i];
      }
    }
  }

  if (!this.view) {
    this.view = this.proxyManager.createProxy('Views', type, { name });

    // Update orientation
    const { axis, orientation, viewUp } = VIEW_ORIENTATIONS[name];
    this.view.updateOrientation(axis, orientation, viewUp);
  }

  return this.view;
}

// ----------------------------------------------------------------------------

function changeViewType(value) {
  const [type, name] = value.split(':');
  const container = this.$el.querySelector('.js-view');

  this.view = this.getView(type, name);
  this.view.setContainer(container);
  this.view.resetCamera();
  this.view.resize();
}

// ----------------------------------------------------------------------------

function resetCamera() {
  if (this.view) {
    this.view.resetCamera();
  }
}

// ----------------------------------------------------------------------------

function onMounted() {
  this.changeViewType(DEFAULT_VIEW_TYPE);
  window.addEventListener('resize', this.view.resize);

  this.subscriptions = [
    {
      unsubscribe: () => window.removeEventListener('resize', this.view.resize),
    },
  ];
}

// ----------------------------------------------------------------------------

function onBeforeDestroy() {
  if (this.view) {
    this.view.setContainer(null);
  }

  while (this.subscriptions.length) {
    this.subscriptions.pop().unsubscribe();
  }
}

// ----------------------------------------------------------------------------

export default {
  inject: ['proxyManager'],
  data: () => ({
    view: null,
    currentType: DEFAULT_VIEW_TYPE,
    types: VIEW_TYPES,
  }),
  methods: {
    onMounted,
    onBeforeDestroy,
    getView,
    changeViewType,
    resetCamera,
  },
  mounted() {
    this.$nextTick(this.onMounted);
  },
  beforeDestroy: onBeforeDestroy,
};
