export default {
  namespaced: true,

  state: {
    showDialog: false,
    currentScreenshot: null,
  },

  mutations: {
    takeScreenshot(state, screenshot) {
      state.currentScreenshot = screenshot;
      state.showDialog = true;
    },
    closeDialog(state) {
      state.showDialog = false;
    },
  },
};
