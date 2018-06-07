import VtkView from 'paraview-glance/src/components/core/VtkView';
import viewHelper from 'paraview-glance/src/components/core/VtkView/helper';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function updateLayout({ count, current }) {
  this.views = viewHelper.getViews(this.proxyManager, count, current);
}

// ----------------------------------------------------------------------------
// Vue LifeCycle
// ----------------------------------------------------------------------------

function onMounted() {
  if (this.views.length === 0) {
    this.views = viewHelper.getViews(this.proxyManager);
  }
}

export default {
  inject: ['proxyManager'],
  name: 'LayoutView',
  data: () => ({
    views: [],
    layoutStyle: {},
  }),
  computed: {
    gridTemplateRows: function gridTemplateRows() {
      return this.views.length < 4 ? '1fr' : '1fr 1fr';
    },
    gridTemplateColumns: function gridTemplateColumns() {
      return this.views.length < 2 ? '1fr' : '1fr 1fr';
    },
  },
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
