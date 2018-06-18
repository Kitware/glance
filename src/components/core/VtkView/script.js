import { Events, Widgets } from 'paraview-glance/src/constants';
import {
  DEFAULT_VIEW_TYPE,
  VIEW_TYPES,
} from 'paraview-glance/src/components/core/VtkView/constants';

import PalettePicker from 'paraview-glance/src/components/widgets/PalettePicker';
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

function getAvailableActions() {
  const actions = viewHelper.getViewActions(this.proxyManager);
  actions.single = this.layoutCount > 1;
  actions.split = this.layoutCount < 4;
  return actions;
}

// ----------------------------------------------------------------------------

function resetCamera() {
  if (this.view) {
    this.view.resetCamera();
  }
}
// ----------------------------------------------------------------------------

function deleteCropWidget() {
  if (this.cropWidget) {
    this.widgetManager.destroyWidget(Widgets.CROP, this.cropWidget);
    this.cropWidget = null;
  }
}

// ----------------------------------------------------------------------------

function toggleCrop() {
  if (this.cropWidget) {
    this.deleteCropWidget();
  } else {
    // target first image data source we get
    const source = this.proxyManager
      .getSources()
      .find((s) => s.getType() === 'vtkImageData');
    if (!source) {
      // TODO warn user
      console.warn('Cannot enable crop: no image dataset');
      return;
    }

    const volumeRep = this.proxyManager
      .getRepresentations()
      .find((r) => r.getInput() === source && r.getProxyName() === 'Volume');

    if (!volumeRep) {
      // TODO warn user
      console.warn('Cannot enable crop: no volume representation');
      return;
    }

    this.cropWidget = this.widgetManager.newWidget(Widgets.CROP);
    this.cropWidget.setInteractor(this.view.getInteractor());
    this.cropWidget.setVolumeMapper(volumeRep.getMapper());
    this.cropWidget.setHandleSize(12);

    // Delete widget if representation get deleted
    this.cropWidgetRepresentationId = volumeRep.getProxyId();

    this.widgetManager.enable(Widgets.CROP, this.cropWidget);

    // Auto render any view when editing widget
    this.cropWidget.onModified(() => {
      this.proxyManager.autoAnimateViews();
    });
  }
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
      viewData: this.viewData,
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
    this.proxyManager.onProxyRegistrationChange((e) => {
      // Remove crop widget if its representation get deleted
      if (
        this.cropWidget &&
        e.action === 'unregister' &&
        e.proxyId === this.cropWidgetRepresentationId
      ) {
        this.deleteCropWidget();
      }

      // When proxy change, just re-render widget
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
    this.deleteCropWidget();
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
      viewTypes: VIEW_TYPES,
      backgroundSheet: false,
      cropWidget: null,
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
    quadView,
    resetCamera,
    rollLeft,
    rollRight,
    screenCapture,
    singleView,
    splitView,
    toggleCrop,
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
