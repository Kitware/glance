import { DEFAULT_BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';

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
    // ------------------
    // External mutations
    // ------------------

    GLOBAL_BG(state, bg) {
      state.backgroundColor = bg;
    },
    GLOBAL_ORIENT_AXIS(state, flag) {
      state.orientationAxis = flag;
    },
    GLOBAL_ORIENT_PRESET(state, preset) {
      state.orientationPreset = preset;
    },
    GLOBAL_AXIS_TYPE(state, axisType) {
      state.axisType = axisType;
    },
  },
};
