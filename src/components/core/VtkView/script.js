import { Events, Widgets } from 'paraview-glance/src/constants';
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
  const actions = viewHelper.getViewActions(this.proxyManager);
  actions.single = this.layoutCount > 1;
  actions.split = this.layoutCount < 4;

  if (actions.crop) {
    actions.resetCrop = false;
    const volumeRep = this.proxyManager
      .getRepresentations()
      .find((r) => r.getProxyName() === 'Volume');

    if (volumeRep && volumeRep.getCropFilter) {
      actions.resetCrop = volumeRep.getCropFilter().isResetAvailable();
    }
  }

  return actions;
}

// ----------------------------------------------------------------------------

function resetCamera() {
  if (this.view) {
    this.view.resetCamera();
  }
}

// ----------------------------------------------------------------------------

function resetCrop() {
  const volumeRep = this.proxyManager
    .getRepresentations()
    .find((r) => r.getProxyName() === 'Volume');

  if (volumeRep && volumeRep.getCropFilter) {
    const filter = volumeRep.getCropFilter();
    if (filter && filter.reset) {
      filter.reset();
      this.$forceUpdate();
      // FIXME - NEED to reset widget state with correct new bounds
      filter.update();
      this.view.renderLater();
    }
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

function deleteCropWidget() {
  const cropWidget = this.view.getReferenceByName('cropWidget');
  if (cropWidget) {
    this.widgetManager.destroyWidget(cropWidget);
    this.view.set({ cropWidget: null }, true);
  }
}

// ----------------------------------------------------------------------------

function toggleCrop() {
  let cropWidget = this.view.getReferenceByName('cropWidget');

  if (cropWidget) {
    this.deleteCropWidget();
    this.isCropping = false;
  } else {
    const volumeRep = this.proxyManager
      .getRepresentations()
      .find((r) => r.getProxyName() === 'Volume');

    if (!volumeRep) {
      // TODO warn user
      console.warn('Cannot enable crop: no volume representation');
      return;
    }

    cropWidget = this.widgetManager.newWidget(Widgets.CROP, volumeRep);
    cropWidget.setInteractor(this.view.getInteractor());
    cropWidget.setVolumeMapper(volumeRep.getMapper());
    cropWidget.setHandleSize(12);

    this.widgetManager.enable(cropWidget);

    // Auto render any view when editing widget
    cropWidget.onModified(() => {
      this.proxyManager.autoAnimateViews();
    });
    this.view.set({ cropWidget }, true);
    this.isCropping = true;

    // Add subscription to monitor crop change
    if (this.subscriptions.length === 3 && volumeRep.getCropFilter) {
      this.subscriptions.push(
        volumeRep
          .getCropFilter()
          .onModified(() => this.$nextTick(this.$forceUpdate)).unsubscribe
      );
    }
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
  if (this.view) {
    this.view.captureImage().then((imgSrc) => {
      this.$globalBus.$emit(Events.SCREENSHOT, {
        imgSrc,
        viewName: this.view.getReferenceByName('name'),
        viewData: this.viewData,
      });
    });
  }
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
  ];

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
  inject: ['proxyManager', 'widgetManager'],
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
      isCropping: false,
      inAnimation: false,
    };
  },
  computed: {
    viewType() {
      return this.layoutViewType || viewHelper.getViewType(this.view);
    },
  },
  methods: {
    changeViewType,
    deleteCropWidget,
    getAvailableActions,
    onBeforeDestroy,
    onMounted,
    orientationLabels,
    quadView,
    resetCamera,
    resetCrop,
    rollLeft,
    rollRight,
    screenCapture,
    singleView,
    splitView,
    toggleCrop,
    updateOrientation,
    viewTypes,
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
