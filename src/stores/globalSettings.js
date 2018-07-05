import { DEFAULT_BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';

import mTypes from 'paraview-glance/src/stores/mutation-types';

export default {
  state: {
    backgroundColor: DEFAULT_BACKGROUND,
    orientationAxis: true,
    // from VtkView
    orientationPreset: 'default',
    // from VtkView
    axisType: 'arrow',
  },

  mutations: {
    [mTypes.GLOBAL_BG](state, bg) {
      state.backgroundColor = bg;
    },
    [mTypes.GLOBAL_ORIENT_AXIS](state, flag) {
      state.orientationAxis = flag;
    },
    [mTypes.GLOBAL_ORIENT_PRESET](state, preset) {
      state.orientationPreset = preset;
    },
    [mTypes.GLOBAL_AXIS_TYPE](state, axisType) {
      state.axisType = axisType;
    },
  },
};
