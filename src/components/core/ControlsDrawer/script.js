import Datasets from 'paraview-glance/src/components/core/Datasets';
import EditTools from 'paraview-glance/src/components/core/EditTools';
import GlobalSettings from 'paraview-glance/src/components/core/GlobalSettings';

// ----------------------------------------------------------------------------

export default {
  name: 'ControlsDrawer',
  components: {
    Datasets,
    EditTools,
    GlobalSettings,
  },
  data() {
    return {
      activeTab: 0,
    };
  },
};
