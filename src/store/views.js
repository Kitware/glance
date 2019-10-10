import Vue from 'vue';

import { VIEW_TYPES } from 'paraview-glance/src/components/core/VtkView/constants';
import viewHelper from 'paraview-glance/src/components/core/VtkView/helper';

function setViewData(state, viewId, data) {
  Vue.set(state.viewData, viewId, {
    ...(state.viewData[viewId] || {}),
    ...data,
  });
}

export default {
  state: {
    viewData: {},
    viewOrder: VIEW_TYPES.map((v) => v.value),
    viewCount: 0,
  },
  getters: {
    views: (state, getters, rootState) =>
      state.viewOrder
        .filter((v, i) => i < state.viewCount)
        .map((t) => viewHelper.getView(rootState.proxyManager, t)),
  },
  mutations: {
    globalBackground(state, background) {
      // iterate over viewData keys since views[] represents
      // the existing view set, not all views that have existed
      Object.keys(state.viewData).forEach((viewType) =>
        setViewData(state, viewType, { background })
      );
    },
    viewSetBackground(state, { view, background }) {
      setViewData(state, viewHelper.getViewType(view), { background });
    },
    viewsSwapOrder(state, { index, newType }) {
      const result = state.viewOrder.slice();
      const oldViewType = result[index];
      const destIndex = result.indexOf(newType);
      result[index] = newType;
      result[destIndex] = oldViewType;
      state.viewOrder = result;
    },
    viewsReorderQuad(state) {
      state.viewOrder = [
        state.viewOrder[2],
        state.viewOrder[3],
        state.viewOrder[0],
        state.viewOrder[1],
      ];
    },
    setViewCount(state, count) {
      state.viewCount = count;
    },
  },
  actions: {
    updateLayout({ dispatch, commit, state }, { index, count, newType }) {
      if (newType) {
        // swap views
        commit('viewsSwapOrder', { index, newType });
      } else if (count === 1) {
        // Shrink
        commit('viewsSwapOrder', {
          index: 0,
          newType: state.viewOrder[index],
        });
      } else if (index === 0 && count === 2) {
        // Current view should appear as second
        commit('viewsSwapOrder', {
          index,
          newType: state.viewOrder[1],
        });
      } else if (state.viewCount === 4 && count === 2 && index !== 1) {
        commit('viewsReorderQuad');
      }
      dispatch('updateViews', count);
    },
    updateViews({ dispatch, commit, rootState }, count = 1) {
      commit('setViewCount', count);
      dispatch('initViewsData', {
        background: rootState.global.backgroundColor,
      });
    },
    initViewsData({ getters, state }, initialData) {
      // initialize viewData for new views
      getters.views.forEach((view) => {
        const viewType = viewHelper.getViewType(view);
        if (!(viewType in state.viewData)) {
          setViewData(state, viewType, initialData);
        }
      });
    },
  },
};
