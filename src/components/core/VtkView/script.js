import { mapState, mapGetters, mapActions } from 'vuex';

import { Breakpoints } from 'paraview-glance/src/constants';
import {
  ANNOTATIONS,
  DEFAULT_VIEW_TYPE,
} from 'paraview-glance/src/components/core/VtkView/constants';

import PalettePicker from 'paraview-glance/src/components/widgets/PalettePicker';
import ToolbarSheet from 'paraview-glance/src/components/core/ToolbarSheet';
import { BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';
import ToolSvgTarget from 'paraview-glance/src/components/tools/ToolSvgTarget';

import { updateViewOrientationFromBasisAndAxis } from 'paraview-glance/src/utils';

const ROTATION_STEP = 2;

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default {
  name: 'VtkView',
  components: {
    PalettePicker,
    ToolbarSheet,
    ToolSvgTarget,
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
      internalViewId: -1,
      internalIsActive: false,
      palette: BACKGROUND,
      backgroundSheet: false,
      inAnimation: false,
      viewPointMenuVisible: false,
      svgViewBox: '0 0 10 10',
    };
  },
  computed: {
    ...mapState('views', {
      viewProxyId(state) {
        return state.viewTypeToId[this.viewType];
      },
      view(state) {
        return this.$proxyManager.getProxyById(
          state.viewTypeToId[this.viewType]
        );
      },
      axisVisible(state) {
        return state.axisVisible;
      },
      axisType(state) {
        return state.axisType;
      },
      axisPreset(state) {
        return state.axisPreset;
      },
      viewOrientation(state) {
        return state.viewOrientation;
      },
      viewTypeItems(state) {
        return Object.entries(state.viewTypes).map(([viewType, text]) => ({
          text,
          value: viewType,
        }));
      },
    }),
    ...mapGetters(['cameraViewPoints']),
    type() {
      return this.viewType.split(':')[0];
    },
    name() {
      return this.viewType.split(':')[1];
    },
    orientationLabels() {
      return this.axisPreset === 'lps' ? ['L', 'P', 'S'] : ['X', 'Y', 'Z'];
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
  watch: {
    view(view) {
      this.tryMountView(view);
    },
  },
  proxyManagerHooks: {
    onActiveViewChange(view) {
      this.internalIsActive = view === this.view;
    },
    onActiveSourceChange(source) {
      if (
        source &&
        source.getProxyName() === 'TrivialProducer' &&
        this.view.bindRepresentationToManipulator
      ) {
        const representation = this.$proxyManager.getRepresentation(
          source,
          this.view
        );
        this.view.bindRepresentationToManipulator(representation);
        this.view.updateWidthHeightAnnotation();
      }
    },
    onProxyRegistrationChange() {
      // update views annotation
      const hasImageData = this.$proxyManager
        .getSources()
        .find((s) => s.getDataset().isA && s.getDataset().isA('vtkImageData'));
      const views = this.$proxyManager.getViews();

      for (let i = 0; i < views.length; i++) {
        const view = views[i];
        view.setCornerAnnotation('se', '');
        if (view.getProxyName().indexOf('2D') !== -1 && hasImageData) {
          view.setCornerAnnotations(ANNOTATIONS, true);
        } else {
          view.setCornerAnnotation('nw', '');
        }
      }
    },
  },
  mounted() {
    if (this.view) {
      this.tryMountView(this.view);
    }
    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCurrentView();
    });
    this.resizeObserver.observe(this.$el);

    // Initial setup
    this.resizeCurrentView();
  },
  beforeDestroy() {
    this.resizeObserver.disconnect();
    if (this.view) {
      this.unmountView(this.view);
    }
  },
  beforeUpdate() {
    if (!this.view) {
      this.changeViewType(DEFAULT_VIEW_TYPE);
    }
  },
  methods: {
    tryMountView(view) {
      if (this.internalViewId > -1) {
        const oldView = this.$proxyManager.getProxyById(this.internalViewId);
        this.unmountView(oldView);
        this.internalViewId = -1;
      }

      if (view) {
        this.internalViewId = view.getProxyId();
        view.setContainer(this.$el.querySelector('.js-view'));
        view.setOrientationAxesVisibility(this.axisVisible);
        const widgetManager = view.getReferenceByName('widgetManager');
        if (widgetManager) {
          // workaround to disable picking if previously disabled
          if (!widgetManager.getPickingEnabled()) {
            widgetManager.disablePicking();
          }
        }
      }
    },
    unmountView(view) {
      view.setContainer(null);
    },
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
        updateViewOrientationFromBasisAndAxis(
          this.view,
          this.viewOrientation,
          mode,
          this.type === 'View3D' ? 100 : 0
        ).then(() => {
          this.inAnimation = false;
        });
      }
    },
    resizeCurrentView() {
      if (this.view) {
        this.view.resize();

        const [w, h] = this.view.getOpenGLRenderWindow().getSize();
        this.svgViewBox = `0 0 ${w} ${h}`;
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
    ...mapActions('views', [
      'changeBackground',
      'swapViews',
      'singleView',
      'splitView',
      'quadView',
    ]),
    ...mapActions(['takeScreenshot', 'changeCameraViewPoint']),
  },
};
