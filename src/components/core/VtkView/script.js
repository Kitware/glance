import { mapMutations } from 'vuex';

import { Breakpoints } from 'paraview-glance/src/constants';
import {
  DEFAULT_VIEW_TYPE,
  VIEW_TYPES,
  VIEW_TYPES_LPS,
  VIEW_ORIENTATIONS,
} from 'paraview-glance/src/components/core/VtkView/constants';

import PalettePicker from 'paraview-glance/src/components/widgets/PalettePicker';
import ToolbarSheet from 'paraview-glance/src/components/core/ToolbarSheet';
import viewHelper from 'paraview-glance/src/components/core/VtkView/helper';
import { BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';
import { Actions, Mutations } from 'paraview-glance/src/store/types';

const ROTATION_STEP = 2;

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

function getAvailableActions() {
  return {
    single: this.layoutCount > 1,
    split: this.layoutCount < 4,
  };
}

// ----------------------------------------------------------------------------

function resetCamera() {
  if (this.view) {
    this.view.resetCamera();
  }
}

// ----------------------------------------------------------------------------

function updateOrientation(mode) {
  if (this.view && !this.inAnimation) {
    this.inAnimation = true;
    const { axis, orientation, viewUp } = VIEW_ORIENTATIONS[mode];
    this.view.updateOrientation(axis, orientation, viewUp, 100).then(() => {
      this.inAnimation = false;
    });
  }
}

// ----------------------------------------------------------------------------

function rollLeft() {
  if (this.view) {
    this.view.setAnimation(true, this);
    let count = 0;
    let intervalId = null;
    const rotate = () => {
      if (count < 90) {
        count += ROTATION_STEP;
        this.view.rotate(+ROTATION_STEP);
      } else {
        clearInterval(intervalId);
        this.view.setAnimation(false, this);
      }
    };
    intervalId = setInterval(rotate, 1);
  }
}

// ----------------------------------------------------------------------------

function rollRight() {
  if (this.view) {
    this.view.setAnimation(true, this);
    let count = 0;
    let intervalId = null;
    const rotate = () => {
      if (count < 90) {
        count += ROTATION_STEP;
        this.view.rotate(-ROTATION_STEP);
      } else {
        clearInterval(intervalId);
        this.view.setAnimation(false, this);
      }
    };
    intervalId = setInterval(rotate, 1);
  }
}

// ----------------------------------------------------------------------------

function screenCapture() {
  this.$store.dispatch(Actions.TAKE_SCREENSHOT, this.view);
}

// ----------------------------------------------------------------------------

function splitView() {
  this.$emit('layout-update', {
    index: this.layoutIndex,
    count: 2,
    view: this.view,
  });
}

// ----------------------------------------------------------------------------

function quadView() {
  this.$emit('layout-update', {
    index: this.layoutIndex,
    count: 4,
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

function orientationLabels() {
  return this.view.getPresetToOrientationAxes() === 'lps'
    ? ['L', 'P', 'S']
    : ['X', 'Y', 'Z'];
}

// ----------------------------------------------------------------------------

function viewTypes() {
  return this.view.getPresetToOrientationAxes() === 'lps'
    ? VIEW_TYPES_LPS
    : VIEW_TYPES;
}

// ----------------------------------------------------------------------------
// Vue LifeCycle
// ----------------------------------------------------------------------------

function onMounted() {
  if (this.view) {
    this.view.setContainer(this.$el.querySelector('.js-view'));
    const widgetManager = this.view.getReferenceByName('widgetManager');
    if (widgetManager) {
      const enabled = widgetManager.getPickingEnabled();
      widgetManager.setRenderer(this.view.getRenderer());
      // workaround to disable picking if previously disabled
      if (!enabled) {
        widgetManager.disablePicking();
      }
    }
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
    this.proxyManager.onProxyRegistrationChange(() => {
      // When proxy change, just re-render widget
      viewHelper.updateViewsAnnotation(this.proxyManager);
      this.$forceUpdate();
    }).unsubscribe,

    this.view.onModified(() => {
      this.$forceUpdate();
    }).unsubscribe,

    this.proxyManager.onActiveViewChange(() => {
      this.$forceUpdate();
    }).unsubscribe,

    this.proxyManager.onActiveSourceChange(() => {
      if (this.view.bindRepresentationToManipulator) {
        const activeSource = this.proxyManager.getActiveSource();
        const representation = this.proxyManager.getRepresentation(
          activeSource,
          this.view
        );
        this.view.bindRepresentationToManipulator(representation);
        this.view.updateWidthHeightAnnotation();
      }
    }).unsubscribe,
  ];
  this.initialSubscriptionLength = this.subscriptions.length;

  // Initial setup
  this.resizeCurrentView();
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
  name: 'VtkView',
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
    viewData: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      palette: BACKGROUND,
      backgroundSheet: false,
      inAnimation: false,
    };
  },
  computed: {
    proxyManager() {
      return this.$store.state.proxyManager;
    },
    viewType() {
      return this.layoutViewType || viewHelper.getViewType(this.view);
    },
    smallScreen() {
      return this.$vuetify.breakpoint.width < Breakpoints.md;
    },
    singleViewButton() {
      return this.layoutCount > 1;
    },
    flipViewButton() {
      return (
        this.layoutCount === 1 ||
        (this.layoutCount === 4 && this.layoutIndex % 2 === 1)
      );
    },
    quadViewButton() {
      return this.layoutCount === 2 && this.layoutIndex === 1;
    },
  },
  methods: {
    changeViewType,
    getAvailableActions,
    onBeforeDestroy,
    onMounted,
    orientationLabels,
    quadView,
    resetCamera,
    rollLeft,
    rollRight,
    screenCapture,
    singleView,
    splitView,
    updateOrientation,
    viewTypes,
    ...mapMutations({
      takeScreenshot: Mutations.TAKE_SCREENSHOT,
    }),
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
};
