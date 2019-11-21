import viewHelper from 'paraview-glance/src/components/core/VtkView/helper';
import { wrapMutationAsAction } from 'paraview-glance/src/utils';

export default {
  namespaced: true,

  state: {
    showDialog: false,
    currentScreenshot: null,
  },

  mutations: {
    openScreenshotDialog(state, screenshot) {
      state.currentScreenshot = screenshot;
      state.showDialog = true;
    },
    closeScreenshotDialog(state) {
      state.showDialog = false;
    },
  },

  actions: {
    takeScreenshot({ commit, rootState }, viewToUse = null) {
      const view = viewToUse || rootState.proxyManager.getActiveView();
      const viewType = viewHelper.getViewType(view);
      if (view) {
        return view.captureImage().then((imgSrc) => {
          commit('openScreenshotDialog', {
            imgSrc,
            viewName: view.getName(),
            viewData: {
              background: rootState.views.backgroundColors[viewType],
            },
          });
        });
      }
      return Promise.resolve();
    },
  },
};
