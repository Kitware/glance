import create2DTool, {
  updateProps,
} from 'paraview-glance/src/components/tools/MeasurementTools/tools/ToolTemplate2D';

// ----------------------------------------------------------------------------

const AngleComponent = create2DTool('Angle', {
  methods: {
    initialMeasurements() {
      return {
        angle: 0.0,
      };
    },
    getMeasurementLabels() {
      return ['Angle'];
    },
    getDisplayedMeasurements() {
      return {
        Angle: `${this.measurements.angle.toFixed(2)}°`,
      };
    },
    updateMeasurements() {
      const widget = this.widgetProxy.getWidget();
      this.measurements.angle = (widget.getAngle() * 180) / Math.PI;

      if (this.finalized) {
        this.widgetProxy.getAllViewWidgets().forEach((vw) => {
          vw.setText(this.displayedMeasurements.Angle);
        });
      }
    },
    donePlacing() {
      const state = this.widgetProxy.getWidgetState();
      const numberOfHandles = state.getHandleList().length;
      return numberOfHandles === 3;
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
      viewWidget.setTextStateIndex(1);
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

export default AngleComponent;
