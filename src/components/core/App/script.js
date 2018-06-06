import LayoutView from 'paraview-glance/src/components/core/LayoutView';

const data = () => ({
  sidebar: true,
  activeTab: 0,
});

export default {
  name: 'App',
  components: {
    LayoutView,
  },
  data,
};
