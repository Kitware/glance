import PaintTool from 'paraview-glance/src/components/tools/PaintTool';
import MeasurementTools from 'paraview-glance/src/components/tools/MeasurementTools';

// ----------------------------------------------------------------------------

export default {
  name: 'EditTools',
  components: {
    PaintTool,
    MeasurementTools,
  },
  data() {
    return {
      enabledTool: '',
    };
  },
  methods: {
    setEnabledTool(tool, flag) {
      this.enabledTool = flag ? tool : '';
    },
  },
};
