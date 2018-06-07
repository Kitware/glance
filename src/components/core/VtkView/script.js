import { Events } from 'paraview-glance/src/constants';
import {
  DEFAULT_VIEW_TYPE,
  VIEW_TYPES,
} from 'paraview-glance/src/components/core/VtkView/constants';

import ToolbarSheet from 'paraview-glance/src/components/core/ToolbarSheet';
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
    this.$globalBus.$emit(Events.SCREENSHOT, {
      imgSrc: this.view.captureImage(),
      viewName: this.view.getReferenceByName('name'),
    });
  }
}

// ----------------------------------------------------------------------------

function splitScreen() {
  const nbViews = viewHelper.getNumberOfVisibleViews(this.proxyManager);

  const newNbViews = nbViews < 2 ? 2 : 4;
  this.$emit('layout-update', { count: newNbViews, current: this.view });

  // Update actions state
  this.updateActionState();
}

// ----------------------------------------------------------------------------

function singleView() {
  this.$emit('layout-update', { count: 1, current: this.view });
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
  components: {
    ToolbarSheet,
  },
  props: ['initialView'],
  data() {
    return {
      view: this.initialView,
      currentType: DEFAULT_VIEW_TYPE,
      types: VIEW_TYPES,
      actions: {},
      backgroundSheet: false,
    };
  },
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
