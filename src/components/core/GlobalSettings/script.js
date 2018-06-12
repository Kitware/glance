import PalettePicker from 'paraview-glance/src/components/core/PalettePicker';
import { BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';

function setOrientationAxesVisible(visible) {
  this.proxyManager
    .getViews()
    .forEach((view) => view.setOrientationAxesVisibility(visible));
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
};
