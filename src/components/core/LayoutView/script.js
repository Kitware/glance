import { mapActions, mapState, mapGetters } from 'vuex';

import VtkView from 'paraview-glance/src/components/core/VtkView';
import { Actions, Getters, Mutations } from 'paraview-glance/src/stores/types';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function setViewBackground(view, background) {
  this.$store.commit(Mutations.VIEW_SET_BACKGROUND, {
    viewId: view.getProxyId(),
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
    mapGetters({
      views: Getters.VIEWS,
    }),
    mapState({
      proxyManager: 'proxyManager',
      viewData: (state) => state.views.viewData,
      order: (state) => state.views.viewOrder,
      gridTemplateRows(state) {
        return state.views.viewCount < 4 ? '1fr' : '1fr 1fr';
      },
      gridTemplateColumns(state) {
        return state.views.viewCount < 2 ? '1fr' : '1fr 1fr';
      },
    })
  ),
  methods: Object.assign(
    {
      setViewBackground,
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
