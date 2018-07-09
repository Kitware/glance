import GpuInformation from 'paraview-glance/src/components/widgets/GPUInformation';
import PalettePicker from 'paraview-glance/src/components/widgets/PalettePicker';
import { BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';
import { Mutations } from 'paraview-glance/src/stores/types';

const ORIENTATION_PRESETS = [
  { text: 'XYZ', value: 'default' },
  { text: 'LPS', value: 'lps' },
];

const AXIS_TYPES = [
  { text: 'Arrows', value: 'arrow' },
  { text: 'Cube', value: 'cube' },
];

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function setOrientationAxesVisible(visible) {
  this.proxyManager.getViews().forEach((view) => {
    view.setOrientationAxesVisibility(visible);
    view.renderLater();
  });
}

// ----------------------------------------------------------------------------

function setAxisType(type) {
  this.proxyManager.getViews().forEach((view) => {
    view.setOrientationAxesType(type);
  });
  // will call view.renderLater()
  this.setPresetToOrientationAxes(this.orientationPreset);
}

// ----------------------------------------------------------------------------

function setPresetToOrientationAxes(presetName) {
  this.proxyManager.getViews().forEach((view) => {
    view.setPresetToOrientationAxes(presetName);
    view.renderLater();
  });
}

// ----------------------------------------------------------------------------

function setAnnotationOpacity(opacity) {
  this.proxyManager
    .getViews()
    .forEach((view) => view.setAnnotationOpacity(opacity));
}

// ----------------------------------------------------------------------------

function pushGlobalSettings() {
  this.setOrientationAxesVisible(this.orientationAxis);
  this.setAnnotationOpacity(this.annotationOpacity);
}

// ----------------------------------------------------------------------------

export default {
  name: 'GlobalSettings',
  components: {
    PalettePicker,
    GpuInformation,
  },
  data() {
    return {
      palette: BACKGROUND,
      annotationOpacity: 1,
      orientationPresets: ORIENTATION_PRESETS,
      axisTypes: AXIS_TYPES,
    };
  },
  computed: {
    proxyManager() {
      return this.$store.state.proxyManager;
    },
    backgroundColor: {
      get() {
        return this.$store.state.global.backgroundColor;
      },
      set(color) {
        this.$store.commit(Mutations.GLOBAL_BG, color);
      },
    },
    orientationAxis: {
      get() {
        return this.$store.state.global.orientationAxis;
      },
      set(flag) {
        this.$store.commit(Mutations.GLOBAL_ORIENT_AXIS, flag);
      },
    },
    orientationPreset: {
      get() {
        return this.$store.state.global.orientationPreset;
      },
      set(preset) {
        this.$store.commit(Mutations.GLOBAL_ORIENT_PRESET, preset);
      },
    },
    axisType: {
      get() {
        return this.$store.state.global.axisType;
      },
      set(axisType) {
        this.$store.commit(Mutations.GLOBAL_AXIS_TYPE, axisType);
      },
    },
  },
  watch: {
    orientationAxis: setOrientationAxesVisible,
    orientationPreset: setPresetToOrientationAxes,
    annotationOpacity: setAnnotationOpacity,
    axisType: setAxisType,
  },
  methods: {
    setAxisType,
    setOrientationAxesVisible,
    setAnnotationOpacity,
    setPresetToOrientationAxes,
    pushGlobalSettings,
  },
  created() {
    this.subscription = this.proxyManager.onProxyRegistrationChange(() => {
      this.pushGlobalSettings();
    });
  },
  beforeDestroy() {
    this.subscription.unsubscribe();
  },
};
