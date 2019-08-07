import Vue from 'vue';

import { VIEW_TYPES } from 'paraview-glance/src/components/core/VtkView/constants';
import viewHelper from 'paraview-glance/src/components/core/VtkView/helper';
import { Actions, Getters, Mutations } from 'paraview-glance/src/store/types';

function setViewData(state, viewId, data) {
  Vue.set(
    state.viewData,
    viewId,
    Object.assign({}, state.viewData[viewId] || {}, data)
  );
}

export default {
  state: {
    viewData: {},
    viewOrder: VIEW_TYPES.map((v) => v.value),
    viewCount: 0,
  },
  getters: {
    VIEWS: (state, getters, rootState) =>
      state.viewOrder
        .filter((v, i) => i < state.viewCount)
        .map((t) => viewHelper.getView(rootState.proxyManager, t)),
  },
  mutations: {
    GLOBAL_BG(state, background) {
      // iterate over viewData keys since views[] represents
      // the existing view set, not all views that have existed
      Object.keys(state.viewData).forEach((viewType) =>
        setViewData(state, viewType, { background })
      );
    },
    VIEW_SET_BACKGROUND(state, { view, background }) {
      setViewData(state, viewHelper.getViewType(view), { background });
    },
    VIEWS_SWAP_ORDER(state, { index, newType }) {
      const result = state.viewOrder.slice();
      const oldViewType = result[index];
      const destIndex = result.indexOf(newType);
      result[index] = newType;
      result[destIndex] = oldViewType;
      state.viewOrder = result;
    },
    VIEWS_REORDER_QUAD(state) {
      state.viewOrder = [
        state.viewOrder[2],
        state.viewOrder[3],
        state.viewOrder[0],
        state.viewOrder[1],
      ];
    },
    SET_VIEW_COUNT(state, count) {
      state.viewCount = count;
    },
  },
  actions: {
    UPDATE_LAYOUT({ dispatch, commit, state }, { index, count, newType }) {
      if (newType) {
        // swap views
        commit(Mutations.VIEWS_SWAP_ORDER, { index, newType });
      } else if (count === 1) {
        // Shrink
        commit(Mutations.VIEWS_SWAP_ORDER, {
          index: 0,
          newType: state.viewOrder[index],
        });
      } else if (index === 0 && count === 2) {
        // Current view should appear as second
        commit(Mutations.VIEWS_SWAP_ORDER, {
          index,
          newType: state.viewOrder[1],
        });
      } else if (state.viewCount === 4 && count === 2 && index !== 1) {
        commit(Mutations.VIEWS_REORDER_QUAD);
      }
      dispatch(Actions.UPDATE_VIEWS, count);
    },
    UPDATE_VIEWS({ dispatch, commit, rootState }, count = 1) {
      commit(Mutations.SET_VIEW_COUNT, count);
      dispatch(Actions.INIT_VIEWS_DATA, {
        background: rootState.global.backgroundColor,
      });
    },
    INIT_VIEWS_DATA({ getters, state }, initialData) {
      // initialize viewData for new views
      getters[Getters.VIEWS].forEach((view) => {
        const viewType = viewHelper.getViewType(view);
        if (!(viewType in state.viewData)) {
          setViewData(state, viewType, initialData);
        }
      });
    },
  },
};
