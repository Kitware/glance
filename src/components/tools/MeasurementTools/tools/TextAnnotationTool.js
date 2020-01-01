import create2DTool, {
  updateProps,
} from 'paraview-glance/src/components/tools/MeasurementTools/tools/ToolTemplate2D';

// ----------------------------------------------------------------------------

const RulerComponent = create2DTool('Text', {
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
    updateMeasurements() {
      this.widgetProxy.getAllViewWidgets().forEach((vw) => {
        vw.setText(this.name);
      });
    },
    donePlacing() {
      const state = this.widgetProxy.getWidgetState();
      const numberOfHandles = state.getHandleList().length;
      return numberOfHandles === 1;
    },
    setupViewWidget(viewWidget) {
      viewWidget.setCircleProps({
        'stroke-width': 3,
        fill: 'transparent',
        r: 8,
      });
      viewWidget.setTextProps({
        dx: 12,
        dy: -12,
      });
      viewWidget.setText('');
      viewWidget.setHandleVisibility(false);
      viewWidget.setTextStateIndex(0);
    },
    setWidgetColor(viewWidget, hex) {
      updateProps(viewWidget, {
        Text: { fill: hex },
        Circle: { stroke: hex },
      });
    },
    setWidgetTextSize(viewWidget, size) {
      const scaledSize = size * (window.devicePixelRatio || 1);
      updateProps(viewWidget, {
        Text: { style: `font-size: ${scaledSize}px` },
      });
    },
  },
});

export default RulerComponent;
