import LayoutView from 'paraview-glance/src/components/LayoutView';

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
