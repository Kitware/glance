export default {
  state: {
    showDialog: false,
    currentScreenshot: null,
  },

  mutations: {
    TAKE_SCREENSHOT(state, screenshot) {
      state.currentScreenshot = screenshot;
      state.showDialog = true;
    },
    CLOSE_SCREENSHOT_DIALOG(state) {
      state.showDialog = false;
    },
  },
};
