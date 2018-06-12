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
    };
  },
  watch: {
    orientationAxis: setOrientationAxesVisible,
  },
  methods: {
    setBackgroundColor,
  },
};
