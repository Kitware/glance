import PaintTool from 'paraview-glance/src/components/tools/PaintTool';
import MeasurementTools from 'paraview-glance/src/components/tools/MeasurementTools';
import CropTool from 'paraview-glance/src/components/tools/CropTool';

// ----------------------------------------------------------------------------

export default {
  name: 'EditTools',
  components: {
    PaintTool,
    MeasurementTools,
    CropTool,
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
