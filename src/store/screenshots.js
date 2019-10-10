import viewHelper from 'paraview-glance/src/components/core/VtkView/helper';

export default {
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
      if (view) {
        return view.captureImage().then((imgSrc) => {
          commit('openScreenshotDialog', {
            imgSrc,
            viewName: view.getName(),
            viewData: rootState.views.viewData[viewHelper.getViewType(view)],
          });
        });
      }
      return Promise.resolve();
    },
  },
};
