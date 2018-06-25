import Vue from 'vue';
import Vuex from 'vuex';

import { DEFAULT_BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';
import { SET_GLOBAL_BG } from 'paraview-glance/src/stores/mutation-types';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    global: {
      backgroundColor: DEFAULT_BACKGROUND,
    },
  },
  mutations: {
    [SET_GLOBAL_BG](state, bg) {
      state.global.backgroundColor = bg;
    },
  },
});

export default store;
