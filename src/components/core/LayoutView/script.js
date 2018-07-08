import { mapActions, mapState } from 'vuex';

import VtkView from 'paraview-glance/src/components/core/VtkView';
import mTypes from 'paraview-glance/src/stores/mutation-types';
import aTypes from 'paraview-glance/src/stores/action-types';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function setViewBackground(view, background) {
  this.$store.commit(mTypes.VIEW_SET_BACKGROUND, {
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
    mapState({
      proxyManager: 'proxyManager',
      views: (state) => state.views.views,
      viewData: (state) => state.views.viewData,
      order: (state) => state.views.viewOrder,
      gridTemplateRows(state) {
        return state.views.views.length < 4 ? '1fr' : '1fr 1fr';
      },
      gridTemplateColumns(state) {
        return state.views.views.length < 2 ? '1fr' : '1fr 1fr';
      },
    })
  ),
  methods: Object.assign(
    {
      setViewBackground,
    },
    mapActions({
      updateViews: aTypes.UPDATE_VIEWS,
      updateLayout: aTypes.UPDATE_LAYOUT,
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
