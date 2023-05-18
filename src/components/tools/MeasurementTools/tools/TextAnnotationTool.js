import create2DTool from 'paraview-glance/src/components/tools/MeasurementTools/tools/ToolTemplate2D';
import TextSvg from 'paraview-glance/src/components/tools/MeasurementTools/svg/TextSvg';

// ----------------------------------------------------------------------------

const TextComponent = create2DTool('Text', {
  svgComponent: TextSvg,
  watch: {
    name() {
      this.updateMeasurements();
    },
  },
  methods: {
    initialMeasurements() {
      return {};
    },
    getMeasurementLabels() {
      return [];
    },
    getDisplayedMeasurements() {
      return {};
    },
    updateMeasurements() {},
    donePlacing() {
      const state = this.widgetProxy.getWidgetState();
      const numberOfHandles = state.getHandleList().length;
      return numberOfHandles === 1;
    },
    setupViewWidget(viewWidget) {
      viewWidget.setHandleVisibility(false);
    },
  },
});

export default TextComponent;
