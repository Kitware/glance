import { Events, Messages } from 'paraview-glance/src/constants';
import {
  DEFAULT_VIEW_TYPE,
  VIEW_TYPES,
} from 'paraview-glance/src/components/core/VtkView/constants';

import viewHelper from 'paraview-glance/src/components/core/VtkView/helper';

// ----------------------------------------------------------------------------
// Component API
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
    this.$eventBus.$emit(Events.SCREENSHOT, {
      imgSrc: this.view.captureImage(),
      viewName: this.view.getReferenceByName('name'),
    });
  }
}

// ----------------------------------------------------------------------------

function splitScreen() {
  // FIXME the VtkView should not make assumption on how layout
  // should handle the count split... (but good enough for now)
  const nbViews = viewHelper.getNumberOfVisibleViews(this.proxyManager);
  console.log('splitScreen', nbViews);
  switch (nbViews) {
    case 1:
      this.$emit(Events.LAYOUT_UPDATE, { count: 2, current: this.view });
      break;
    case 2:
      console.log('case 2');
    case 3:
      console.log('case 3');
    case 4:
      console.log('case 4');
    default:
      console.log('default');
      console.log('send 4');
      this.$emit(Events.LAYOUT_UPDATE, { count: 4, current: this.view });
      break;
  }

  // Update actions state
  this.updateActionState();
}

// ----------------------------------------------------------------------------

function singleView() {
  this.$emit(Events.LAYOUT_UPDATE, { count: 1, current: this.view });
}

// ----------------------------------------------------------------------------
// Vue LifeCycle
// ----------------------------------------------------------------------------

function onMounted() {
  if (!this.view) {
    this.view = viewHelper.bindView(
      this.proxyManager,
      DEFAULT_VIEW_TYPE,
      this.$el.querySelector('.js-view')
    );
  } else {
    this.view.setContainer(this.$el.querySelector('.js-view'));
  }

  // Closure creation for callback
  this.resizeCurrentView = () => {
    if (this.view) {
      this.view.resize();
    }
  };
  this.updateActionState = () => {
    this.actions = viewHelper.getViewActions(this.proxyManager);
  };

  // Event handling
  window.addEventListener('resize', this.resizeCurrentView);

  // Capture event handler to release then at exit
  this.subscriptions = [
    () => window.removeEventListener('resize', this.resizeCurrentView),
    this.proxyManager.onProxyRegistrationChange(this.updateActionState)
      .unsubscribe,
  ];

  // Initial setup
  this.resizeCurrentView();
  this.updateActionState();
}

// ----------------------------------------------------------------------------

function onBeforeDestroy() {
  if (this.view) {
    this.view.setContainer(null);
  }

  while (this.subscriptions.length) {
    this.subscriptions.pop()();
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
