import { VIEW_TYPES } from 'paraview-glance/src/components/core/VtkView/constants';
import VtkView from 'paraview-glance/src/components/core/VtkView';
import viewHelper from 'paraview-glance/src/components/core/VtkView/helper';
import { BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';
import { Events } from 'paraview-glance/src/constants';

// ----------------------------------------------------------------------------
// Helper
// ----------------------------------------------------------------------------

function swapOrder(order, index, newType) {
  const result = order.slice();
  const oldViewType = result[index];
  const destIndex = result.indexOf(newType);
  result[index] = newType;
  result[destIndex] = oldViewType;
  return result;
}

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function updateLayout({ index, count, newType }) {
  if (newType) {
    // swap views
    this.order = swapOrder(this.order, index, newType);
  } else if (count === 1) {
    // Shrink
    this.order = swapOrder(this.order, 0, this.order[index]);
  } else if (index === 0 && count === 2) {
    // Current view should appear as second
    this.order = swapOrder(this.order, index, this.order[1]);
  }
  this.updateViews(count);
  this.$globalBus.$emit(Events.LAYOUT_CHANGE);
}

// ----------------------------------------------------------------------------

function updateViews(count = 1) {
  this.views = this.order
    .filter((v, i) => i < count)
    .map((t) => viewHelper.getView(this.proxyManager, t));

  // initialize viewData for new views
  this.views.forEach((view) => {
    const viewId = view.getProxyId();
    if (!(viewId in this.viewData)) {
      this.viewData[viewId] = {
        background: BACKGROUND[0],
      };
    }
  });
}

// ----------------------------------------------------------------------------

function setViewBackground(view, bg) {
  this.viewData[view.getProxyId()].background = bg;
}

// ----------------------------------------------------------------------------
// Vue LifeCycle
// ----------------------------------------------------------------------------

function onMounted() {
  if (this.views.length === 0) {
    this.updateViews();
  }
}

export default {
  inject: ['proxyManager'],
  name: 'LayoutView',
  data: () => ({
    views: [],
    viewData: {},
    order: VIEW_TYPES.map((v) => v.value),
  }),
  computed: {
    gridTemplateRows() {
      return this.views.length < 4 ? '1fr' : '1fr 1fr';
    },
    gridTemplateColumns() {
      return this.views.length < 2 ? '1fr' : '1fr 1fr';
    },
  },
  methods: {
    onMounted,
    updateLayout,
    updateViews,
    setViewBackground,
  },
  components: {
    VtkView,
  },
  mounted() {
    this.$nextTick(this.onMounted);
  },
  updated() {
    this.proxyManager.resizeAllViews();
  },
};
