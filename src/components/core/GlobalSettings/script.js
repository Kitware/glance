import PalettePicker from 'paraview-glance/src/components/core/PalettePicker';
import { BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';
import { Events } from 'paraview-glance/src/constants';

function setOrientationAxesVisible(visible) {
  this.proxyManager
    .getViews()
    .forEach((view) => view.setOrientationAxesVisibility(visible));
}

function setBackgroundColor(color) {
  this.$globalBus.$emit(Events.ALL_BACKGROUND_CHANGE, color);
}

function setAnnotationOpacity(opacity) {
  this.proxyManager
    .getViews()
    .forEach((view) => view.setAnnotationOpacity(opacity));
}

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
    annotationOpacity: setAnnotationOpacity
  },
  methods: {
    setBackgroundColor,
  },
};
