import create2DTool, {
  updateProps,
} from 'paraview-glance/src/components/tools/MeasurementTools/tools/ToolTemplate2D';

// ----------------------------------------------------------------------------

const RulerComponent = create2DTool('Ruler', {
  methods: {
    initialMeasurements() {
      return {
        length: 0.0,
      };
    },
    getMeasurementLabels() {
      return ['Length'];
    },
    getDisplayedMeasurements() {
      return {
        Length: `${this.measurements.length.toFixed(2)} mm`,
      };
    },
    updateMeasurements() {
      const widget = this.widgetProxy.getWidget();
      this.measurements.length = widget.getDistance();

      if (this.finalized) {
        this.widgetProxy.getAllViewWidgets().forEach((vw) => {
          vw.setText(this.displayedMeasurements.Length);
        });
      }
    },
    donePlacing() {
      const state = this.widgetProxy.getWidgetState();
      const numberOfHandles = state.getHandleList().length;
      return numberOfHandles === 2;
    },
    setupViewWidget(viewWidget) {
      viewWidget.setCircleProps({
        'stroke-width': 3,
        fill: 'transparent',
        r: 8,
      });
      viewWidget.setLineProps({
        'stroke-width': 2,
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
        Line: { stroke: hex },
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
