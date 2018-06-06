import Landing from 'paraview-glance/src/components/core/Landing';
import LayoutView from 'paraview-glance/src/components/core/LayoutView';

function openFile(url) {
  console.log('openFile', url);
  this.landing = false;
}

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
  methods: {
    openFile,
  },
};
