import { mapActions, mapState } from 'vuex';

import VtkView from 'paraview-glance/src/components/core/VtkView';
import viewHelper from 'paraview-glance/src/components/core/VtkView/helper';
import { Breakpoints } from 'paraview-glance/src/constants';
import { Actions, Getters, Mutations } from 'paraview-glance/src/store/types';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function setViewBackground(view, background) {
  this.$store.commit(Mutations.VIEW_SET_BACKGROUND, {
    view,
    background,
  });
}

// ----------------------------------------------------------------------------

export default {
  name: 'LayoutView',
  props: {
    widgetManager: { required: true },
  },
  computed: Object.assign(
    {
      smallScreen() {
        return this.$vuetify.breakpoint.width < Breakpoints.md;
      },
      views() {
        const views = this.$store.getters[Getters.VIEWS];
        return this.smallScreen ? views.slice(0, 1) : views;
      },
      gridTemplateRows() {
        return this.viewCount < 4 ? '1fr' : '1fr 1fr';
      },
      gridTemplateColumns() {
        return this.viewCount < 2 ? '1fr' : '1fr 1fr';
      },
    },
    mapState({
      proxyManager: 'proxyManager',
      viewData: (state) => state.views.viewData,
      order: (state) => state.views.viewOrder,
      viewCount(state) {
        // only show 1 view on small screens
        return this.smallScreen ? 1 : state.views.viewCount;
      },
    })
  ),
  methods: Object.assign(
    {
      setViewBackground,
      getViewType: viewHelper.getViewType,
    },
    mapActions({
      updateViews: Actions.UPDATE_VIEWS,
      updateLayout: Actions.UPDATE_LAYOUT,
    })
  ),
  components: {
    VtkView,
  },
  created() {
    this.subscriptions = [
      // reset cameras when first source is added
      this.proxyManager.onProxyRegistrationChange(({ action, proxyGroup }) => {
        if (
          proxyGroup === 'Sources' &&
          action === 'register' &&
          this.proxyManager.getSources().length === 1
        ) {
          this.proxyManager.resetCameraInAllViews();
        }
      }),
    ];
  },
  mounted() {
    this.$nextTick(() => {
      if (this.views.length === 0) {
        this.updateViews();
      }
    });
  },
  updated() {
    this.proxyManager.resizeAllViews();
  },
  beforeDestroy() {
    while (this.subscriptions.length) {
      this.subscriptions.pop().unsubscribe();
    }
  },
};
