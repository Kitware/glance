import VtkView from 'paraview-glance/src/components/core/VtkView';
import viewHelper from 'paraview-glance/src/components/core/VtkView/helper';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function updateLayout({ count, current }) {
  this.views = viewHelper.getViews(this.proxyManager, count, current);
  console.log(this.views);
}

// ----------------------------------------------------------------------------
// Vue LifeCycle
// ----------------------------------------------------------------------------

function onMounted() {
  if (this.views.length === 0) {
    this.views = viewHelper.getViews(this.proxyManager);
    console.log(this.views);
  }
}

export default {
  inject: ['proxyManager'],
  name: 'LayoutView',
  data: () => ({
    views: [],
    layoutStyle: {},
  }),
  methods: {
    onMounted,
    updateLayout,
  },
  components: {
    VtkView,
  },
  mounted() {
    this.$nextTick(this.onMounted);
  },
};
