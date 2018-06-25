import Datasets from 'paraview-glance/src/components/core/Datasets';
import GlobalSettings from 'paraview-glance/src/components/core/GlobalSettings';

// ----------------------------------------------------------------------------

export default {
  name: 'ControlsDrawer',
  components: {
    Datasets,
    GlobalSettings,
  },
  data() {
    return {
      activeTab: 0,
    };
  },
};
