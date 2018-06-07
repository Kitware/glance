import {
  DEFAULT_VIEW_TYPE,
  VIEW_TYPES,
} from 'paraview-glance/src/components/core/VtkView/constants';

import viewHelper from 'paraview-glance/src/components/core/VtkView/helper';

// ----------------------------------------------------------------------------
// View API
// ----------------------------------------------------------------------------
function changeViewType(newType) {
  if (this.view) {
    this.view.setContainer(null);
  }
  this.view = viewHelper.bindView(
    this.proxyManager,
    newType,
    this.$el.querySelector('.js-view')
  );
}

// ----------------------------------------------------------------------------

function resetCamera() {
  if (this.view) {
    this.view.resetCamera();
  }
}

// ----------------------------------------------------------------------------

function toggleCrop() {
  console.log('toggleCrop');
}

// ----------------------------------------------------------------------------

function rollLeft() {
  if (this.view) {
    this.view.rotate(+90);
  }
}

// ----------------------------------------------------------------------------

function rollRight() {
  if (this.view) {
    this.view.rotate(-90);
  }
}

// ----------------------------------------------------------------------------

function screenCapture() {
  if (this.view) {
    // const imgSrc = this.view.captureImage();
    // push that image to some data model somewhere...

    // DEBUG - remove
    this.view.openCaptureImage();
    // DEBUG - remove
  }
}

// ----------------------------------------------------------------------------

function splitScreen() {
  // Tell parent how many view are needed
  // 1 -> 2
  // 2 -> 4
  console.log('splitScreen');

  // Update actions state
  this.actions = viewHelper.getViewActions(this.proxyManager);
}

// ----------------------------------------------------------------------------

function singleView() {
  // Tell parent how many view are needed
  // -> 1
  console.log('singleView');

  // Update actions state
  this.actions = viewHelper.getViewActions(this.proxyManager);
}

// ----------------------------------------------------------------------------
// Vue LifeCycle
// ----------------------------------------------------------------------------

function onMounted() {
  this.view = viewHelper.bindView(
    this.proxyManager,
    DEFAULT_VIEW_TYPE,
    this.$el.querySelector('.js-view')
  );

  // Update actions state
  this.actions = viewHelper.getViewActions(this.proxyManager);

  const resizeCurrentView = () => {
    if (this.view) {
      this.view.resize();
    }
  };

  window.addEventListener('resize', resizeCurrentView);

  this.subscriptions = [
    {
      unsubscribe: () =>
        window.removeEventListener('resize', resizeCurrentView),
    },
    this.proxyManager.onProxyRegistrationChange(() => {
      this.actions = viewHelper.getViewActions(this.proxyManager);
    }),
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
// Component
// ----------------------------------------------------------------------------

export default {
  inject: ['proxyManager'],
  data: () => ({
    view: null,
    currentType: DEFAULT_VIEW_TYPE,
    types: VIEW_TYPES,
    actions: {},
  }),
  methods: {
    onMounted,
    onBeforeDestroy,
    changeViewType,
    resetCamera,
    toggleCrop,
    rollLeft,
    rollRight,
    screenCapture,
    splitScreen,
    singleView,
  },
  mounted() {
    this.$nextTick(this.onMounted);
  },
  beforeDestroy: onBeforeDestroy,
};
