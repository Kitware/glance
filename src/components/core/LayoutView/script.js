import { mapActions, mapState } from 'vuex';

import VtkView from 'paraview-glance/src/components/core/VtkView';
import { Breakpoints } from 'paraview-glance/src/constants';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'LayoutView',
  components: {
    VtkView,
  },
  computed: {
    smallScreen() {
      return this.$vuetify.breakpoint.width < Breakpoints.md;
    },
    gridTemplateRows() {
      return this.visibleCount < 4 ? '1fr' : '1fr 1fr';
    },
    gridTemplateColumns() {
      return this.visibleCount < 2 ? '1fr' : '1fr 1fr';
    },
    ...mapState('views', {
      views: (state) => state.viewOrder,
      backgroundColors: (state) => state.backgroundColors,
      visibleCount(state) {
        // only show 1 view on small screens
        return this.smallScreen ? 1 : state.visibleCount;
      },
    }),
  },
  methods: {
    getView(viewType) {
      const [type, name] = viewType.split(':');
      return this.$proxyManager
        .getViews()
        .find(
          (v) => v.getProxyName() === type && (!name || v.getName() === name)
        );
    },
    ...mapActions('views', ['updateLayout']),
  },
  updated() {
    this.$proxyManager.resizeAllViews();
  },
};
