import { mapState, mapActions } from 'vuex';

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

const ROTATION_STEP = 2;

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
    layoutIndex: {
      default: 0,
      type: Number,
    },
    layoutCount: {
      default: 1,
      type: Number,
    },
    viewType: {
      default: '',
      type: String,
    },
    backgroundColor: {
      default: '#000',
      type: String,
    },
  },
  data() {
    return {
      internalIsActive: false,
      palette: BACKGROUND,
      backgroundSheet: false,
      inAnimation: false,
    };
  },
  computed: {
    ...mapState({
      view(state) {
        return this.$proxyManager.getProxyById(
          state.views.viewTypeToId[this.viewType]
        );
      },
      axisVisible(state) {
        return state.views.axisVisible;
      },
      axisType(state) {
        return state.views.axisType;
      },
      axisPreset(state) {
        return state.views.axisPreset;
      },
    }),
    type() {
      return this.viewType.split(':')[0];
    },
    name() {
      return this.viewType.split(':')[1];
    },
    orientationLabels() {
      return this.axisPreset === 'lps' ? ['L', 'P', 'S'] : ['X', 'Y', 'Z'];
    },
    viewTypes() {
      return this.axisPreset === 'lps' ? VIEW_TYPES_LPS : VIEW_TYPES;
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
    isActive() {
      return (
        this.internalIsActive ||
        this.view === this.$proxyManager.getActiveView()
      );
    },
  },
  proxyManagerHooks: {
    onActiveViewChange(view) {
      this.internalIsActive = view === this.view;
    },
    onActiveSourceChange(source) {
      if (this.view.bindRepresentationToManipulator) {
        const representation = this.$proxyManager.getRepresentation(
          source,
          this.view
        );
        this.view.bindRepresentationToManipulator(representation);
        this.view.updateWidthHeightAnnotation();
      }
    },
    onProxyRegistrationChange() {
      viewHelper.updateViewsAnnotation(this.$proxyManager);
    },
  },
  mounted() {
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

    window.addEventListener('resize', this.resizeCurrentView);

    // Initial setup
    this.resizeCurrentView();
  },
  beforeDestroy() {
    if (this.view) {
      this.view.setContainer(null);
    }
    window.removeEventListener('resize', this.resizeCurrentView);
  },
  beforeUpdate() {
    if (!this.view) {
      this.changeViewType(DEFAULT_VIEW_TYPE);
    }
  },
  methods: {
    changeViewType(viewType) {
      this.swapViews({
        index: this.layoutIndex,
        viewType,
      });
    },
    getAvailableActions() {
      return {
        single: this.layoutCount > 1,
        split: this.layoutCount < 4,
      };
    },
    resetCamera() {
      if (this.view) {
        this.view.resetCamera();
      }
    },
    rollLeft() {
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
    },
    rollRight() {
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
    },
    updateOrientation(mode) {
      if (this.view && !this.inAnimation) {
        this.inAnimation = true;
        const { axis, orientation, viewUp } = VIEW_ORIENTATIONS[mode];
        this.view.updateOrientation(axis, orientation, viewUp, 100).then(() => {
          this.inAnimation = false;
        });
      }
    },
    resizeCurrentView() {
      if (this.view) {
        this.view.resize();
      }
    },
    screenCapture() {
      this.takeScreenshot(this.view);
    },
    changeBackgroundColor(color) {
      this.changeBackground({
        viewType: this.viewType,
        color,
      });
    },
    ...mapActions([
      'changeBackground',
      'swapViews',
      'singleView',
      'splitView',
      'quadView',
      'takeScreenshot',
    ]),
  },
};
