import Landing from 'paraview-glance/src/components/core/Landing';
import LayoutView from 'paraview-glance/src/components/core/LayoutView';

const data = () => ({
  landing: true,
  sidebar: true,
  activeTab: 0,
});

export default {
  name: 'App',
  components: {
    Landing,
    LayoutView,
  },
  data,
};
