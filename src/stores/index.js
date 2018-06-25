import Vue from 'vue';
import Vuex from 'vuex';

import { DEFAULT_BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';
import {
  SET_GLOBAL_BG,
  SET_GLOBAL_ORIENT_AXIS,
  SET_GLOBAL_ORIENT_PRESET,
  SET_GLOBAL_AXIS_TYPE,
} from 'paraview-glance/src/stores/mutation-types';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    global: {
      backgroundColor: DEFAULT_BACKGROUND,
      orientationAxis: true,
      // from VtkView
      orientationPreset: 'default',
      // from VtkView
      axisType: 'arrow',
    },
  },
  mutations: {
    [SET_GLOBAL_BG](state, bg) {
      state.global.backgroundColor = bg;
    },
    [SET_GLOBAL_ORIENT_AXIS](state, flag) {
      state.global.orientationAxis = flag;
    },
    [SET_GLOBAL_ORIENT_PRESET](state, preset) {
      state.global.orientationPreset = preset;
    },
    [SET_GLOBAL_AXIS_TYPE](state, axisType) {
      state.global.axisType = axisType;
    },
  },
});

export default store;
