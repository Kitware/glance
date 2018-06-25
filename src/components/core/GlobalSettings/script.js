import { mapState } from 'vuex';

import GpuInformation from 'paraview-glance/src/components/widgets/GPUInformation';
import PalettePicker from 'paraview-glance/src/components/widgets/PalettePicker';
import { BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';
import { SET_GLOBAL_BG } from 'paraview-glance/src/stores/mutation-types';

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
    view.renderLater();
  });
}

// ----------------------------------------------------------------------------

function setPresetToOrientationAxes(presetName) {
  this.proxyManager.getViews().forEach((view) => {
    view.setPresetToOrientationAxes(presetName);
    view.renderLater();
  });
}

// ----------------------------------------------------------------------------

function setBackgroundColor(color) {
  this.$store.commit(SET_GLOBAL_BG, color);
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
  inject: ['proxyManager'],
  components: {
    PalettePicker,
    GpuInformation,
  },
  data() {
    const view = this.proxyManager.getViews()[0];
    return {
      palette: BACKGROUND,
      orientationAxis: true,
      annotationOpacity: 1,
      orientationPreset: view ? view.getPresetToOrientationAxes() : 'default',
      orientationPresets: ORIENTATION_PRESETS,
      axisTypes: AXIS_TYPES,
      axisType: view ? view.getOrientationAxesType() : 'arrow',
    };
  },
  computed: mapState({
    backgroundColor: (state) => state.global.backgroundColor,
  }),
  watch: {
    orientationAxis: setOrientationAxesVisible,
    orientationPreset: setPresetToOrientationAxes,
    annotationOpacity: setAnnotationOpacity,
    axisType: setAxisType,
  },
  methods: {
    setBackgroundColor,
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
