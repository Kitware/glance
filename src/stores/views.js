import Vue from 'vue';

import { VIEW_TYPES } from 'paraview-glance/src/components/core/VtkView/constants';
import viewHelper from 'paraview-glance/src/components/core/VtkView/helper';
import mTypes from 'paraview-glance/src/stores/mutation-types';
import aTypes from 'paraview-glance/src/stores/action-types';

function setViewData(state, viewId, data) {
  Vue.set(
    state.viewData,
    viewId,
    Object.assign({}, state.viewData[viewId] || {}, data)
  );
}

export default {
  state: {
    views: [],
    viewData: {},
    viewOrder: VIEW_TYPES.map((v) => v.value),
  },
  mutations: {
    [mTypes.GLOBAL_BG](state, background) {
      state.views.forEach((view) =>
        setViewData(state, view.getProxyId(), { background })
      );
    },
    [mTypes.VIEW_SET_BACKGROUND](state, { viewId, background }) {
      setViewData(state, viewId, { background });
    },
    [mTypes.VIEWS_SWAP_ORDER](state, { index, newType }) {
      const result = state.viewOrder.slice();
      const oldViewType = result[index];
      const destIndex = result.indexOf(newType);
      result[index] = newType;
      result[destIndex] = oldViewType;
      state.viewOrder = result;
    },
    [mTypes.VIEWS_REORDER_QUAD](state) {
      state.viewOrder = [
        state.viewOrder[2],
        state.viewOrder[3],
        state.viewOrder[0],
        state.viewOrder[1],
      ];
    },
    [mTypes.SET_VIEWS](state, views) {
      state.views = views;
    },
    [mTypes.VIEWS_INIT_DATA](state, initialData) {
      // initialize viewData for new views
      state.views.forEach((view) => {
        const viewId = view.getProxyId();
        if (!(viewId in state.viewData)) {
          setViewData(state, viewId, initialData);
        }
      });
    },
  },
  actions: {
    [aTypes.UPDATE_LAYOUT](
      { dispatch, commit, state },
      { index, count, newType }
    ) {
      if (newType) {
        // swap views
        commit(mTypes.VIEWS_SWAP_ORDER, { index, newType });
      } else if (count === 1) {
        // Shrink
        commit(mTypes.VIEWS_SWAP_ORDER, {
          index: 0,
          newType: state.viewOrder[index],
        });
      } else if (index === 0 && count === 2) {
        // Current view should appear as second
        commit(mTypes.VIEWS_SWAP_ORDER, { index, newType: state.viewOrder[1] });
      } else if (state.views.length === 4 && count === 2 && index !== 1) {
        commit(mTypes.VIEWS_REORDER_QUAD);
      }
      dispatch(aTypes.UPDATE_VIEWS, count);
    },
    [aTypes.UPDATE_VIEWS]({ state, commit, rootState }, count = 1) {
      commit(
        mTypes.SET_VIEWS,
        state.viewOrder
          .filter((v, i) => i < count)
          .map((t) => viewHelper.getView(rootState.proxyManager, t))
      );

      commit(mTypes.VIEWS_INIT_DATA, {
        background: rootState.global.backgroundColor,
      });
    },
  },
};
