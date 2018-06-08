import { Events } from 'paraview-glance/src/constants';
import {
  DEFAULT_VIEW_TYPE,
  VIEW_TYPES,
} from 'paraview-glance/src/components/core/VtkView/constants';

import PalettePicker from 'paraview-glance/src/components/core/PalettePicker';
import ToolbarSheet from 'paraview-glance/src/components/core/ToolbarSheet';
import viewHelper from 'paraview-glance/src/components/core/VtkView/helper';
import { BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function changeViewType(newType) {
  if (this.layoutManager) {
    this.$emit('layout-update', {
      count: this.layoutCount,
      index: this.layoutIndex,
      view: this.view,
      newType,
    });
  } else {
    this.view = viewHelper.bindView(
      this.proxyManager,
      newType,
      this.$el.querySelector('.js-view')
    );
  }
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
  const newNbViews = this.layoutCount < 2 ? 2 : 4;
  this.$emit('layout-update', {
    index: this.layoutIndex,
    count: newNbViews,
    view: this.view,
  });
}

// ----------------------------------------------------------------------------

function singleView() {
  this.$emit('layout-update', {
    index: this.layoutIndex,
    count: 1,
    view: this.view,
  });
}

// ----------------------------------------------------------------------------
// Vue LifeCycle
// ----------------------------------------------------------------------------

function onMounted() {
  if (this.view) {
    this.view.setContainer(this.$el.querySelector('.js-view'));
  }

  // Closure creation for callback
  this.resizeCurrentView = () => {
    if (this.view) {
      this.view.resize();
    }
  };

  // Event handling
  window.addEventListener('resize', this.resizeCurrentView);

  // Capture event handler to release then at exit
  this.subscriptions = [
    () => window.removeEventListener('resize', this.resizeCurrentView),
    this.proxyManager.onProxyRegistrationChange(() => this.$forceUpdate())
      .unsubscribe,
  ];

  // Initial setup
  this.resizeCurrentView();
}

// ----------------------------------------------------------------------------

function onBeforeDestroy() {
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
    PalettePicker,
    ToolbarSheet,
  },
  props: {
    view: {
      default: null,
    },
    layoutIndex: {
      default: 0,
      type: Number,
    },
    layoutCount: {
      default: 1,
      type: Number,
    },
    layoutManager: {
      default: false,
      type: Boolean,
    },
    layoutViewType: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      palette: BACKGROUND,
      bgcolor: BACKGROUND[0],
      viewTypes: VIEW_TYPES,
      backgroundSheet: false,
    };
  },
  computed: {
    viewType() {
      return this.layoutViewType || viewHelper.getViewType(this.view);
    },
    actions() {
      const actions = viewHelper.getViewActions(this.proxyManager);
      actions.single = this.layoutCount > 1;
      actions.split = this.layoutCount < 4;
      return actions;
    },
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
  beforeUpdate() {
    if (!this.view) {
      this.changeViewType(DEFAULT_VIEW_TYPE);
    }
  },
  updated() {
    this.view.setContainer(this.$el.querySelector('.js-view'));
  },
};
