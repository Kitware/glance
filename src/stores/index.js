import Vue from 'vue';
import Vuex from 'vuex';

import { DEFAULT_BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';
import {
  SET_GLOBAL_BG,
  SET_GLOBAL_ORIENT_AXIS,
} from 'paraview-glance/src/stores/mutation-types';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    global: {
      backgroundColor: DEFAULT_BACKGROUND,
      orientationAxis: true,
    },
  },
  mutations: {
    [SET_GLOBAL_BG](state, bg) {
      state.global.backgroundColor = bg;
    },
    [SET_GLOBAL_ORIENT_AXIS](state, flag) {
      state.global.orientationAxis = flag;
    },
  },
});

export default store;
