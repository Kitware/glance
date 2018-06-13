import PalettePicker from 'paraview-glance/src/components/widgets/PalettePicker';
import { BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';
import { Events } from 'paraview-glance/src/constants';

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

function setBackgroundColor(color) {
  this.$globalBus.$emit(Events.ALL_BACKGROUND_CHANGE, color);
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
  },
  data() {
    return {
      palette: BACKGROUND,
      orientationAxis: true,
      annotationOpacity: 1,
    };
  },
  watch: {
    orientationAxis: setOrientationAxesVisible,
    annotationOpacity: setAnnotationOpacity,
  },
  methods: {
    setBackgroundColor,
    setOrientationAxesVisible,
    setAnnotationOpacity,
    pushGlobalSettings,
  },
  created() {
    this.subscrition = this.proxyManager.onProxyRegistrationChange(() => {
      this.pushGlobalSettings();
    });
  },
  beforeDestroy() {
    this.subscrition.unsubscribe();
  },
};
