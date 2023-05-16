import create2DTool from 'paraview-glance/src/components/tools/MeasurementTools/tools/ToolTemplate2D';
import RulerSvg from 'paraview-glance/src/components/tools/MeasurementTools/svg/RulerSvg';

// ----------------------------------------------------------------------------

const RulerComponent = create2DTool('Ruler', {
  svgComponent: RulerSvg,
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
        Length: `${(
          this.measurements.length * (this.distanceUnitFactor || 1.0)
        ).toFixed(2)} ${this.distanceUnitSymbol || ''}`,
      };
    },
    updateMeasurements() {
      const widget = this.widgetProxy.getWidget();
      this.measurements.length = widget.getDistance();
    },
    donePlacing() {
      const state = this.widgetProxy.getWidgetState();
      const numberOfHandles = state.getHandleList().length;
      return numberOfHandles === 2;
    },
    setupViewWidget(viewWidget) {
      viewWidget.setHandleVisibility(false);
    },
  },
  watch: {
    distanceUnitSymbol() {
      this.widgetProxy.modified();
    },
    distanceUnitFactor() {
      this.widgetProxy.modified();
    },
  },
});

export default RulerComponent;
