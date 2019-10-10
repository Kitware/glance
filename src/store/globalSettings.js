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

    globalBackground(state, bg) {
      state.backgroundColor = bg;
    },
    globalOrientAxis(state, flag) {
      state.orientationAxis = flag;
    },
    globalOrientPreset(state, preset) {
      state.orientationPreset = preset;
    },
    globalAxisType(state, axisType) {
      state.axisType = axisType;
    },
  },
};
