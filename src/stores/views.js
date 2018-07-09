import Vue from 'vue';

import { VIEW_TYPES } from 'paraview-glance/src/components/core/VtkView/constants';
import viewHelper from 'paraview-glance/src/components/core/VtkView/helper';
import { Actions, Mutations } from 'paraview-glance/src/stores/types';

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
    GLOBAL_BG(state, background) {
      state.views.forEach((view) =>
        setViewData(state, view.getProxyId(), { background })
      );
    },
    VIEW_SET_BACKGROUND(state, { viewId, background }) {
      setViewData(state, viewId, { background });
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
    SET_VIEWS(state, views) {
      state.views = views;
    },
    VIEWS_INIT_DATA(state, initialData) {
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
      } else if (state.views.length === 4 && count === 2 && index !== 1) {
        commit(Mutations.VIEWS_REORDER_QUAD);
      }
      dispatch(Actions.UPDATE_VIEWS, count);
    },
    UPDATE_VIEWS({ state, commit, rootState }, count = 1) {
      commit(
        Mutations.SET_VIEWS,
        state.viewOrder
          .filter((v, i) => i < count)
          .map((t) => viewHelper.getView(rootState.proxyManager, t))
      );

      commit(Mutations.VIEWS_INIT_DATA, {
        background: rootState.global.backgroundColor,
      });
    },
  },
};
