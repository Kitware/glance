import { DEFAULT_BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';

export default {
  state: {
    backgroundColor: DEFAULT_BACKGROUND,
    orientationAxis: true,
    // from VtkView
    orientationPreset: 'default',
    // from VtkView
    axisType: 'arrow',
    interactionStyle3D: '3D',
    // Units are in KiB
    maxTextureLODSize: 50000,
  },

  getters: {
    GLOBAL_BG(state) {
      return state.backgroundColor;
    },
    GLOBAL_ORIENT_AXIS(state) {
      return state.orientationAxis;
    },
    GLOBAL_ORIENT_PRESET(state) {
      return state.orientationPreset;
    },
    GLOBAL_AXIS_TYPE(state) {
      return state.axisType;
    },
    GLOBAL_INTERACTION_STYLE_3D(state) {
      return state.interactionStyle3D;
    },
    GLOBAL_MAX_TEXTURE_LOD_SIZE(state) {
      return state.maxTextureLODSize;
    },
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
    GLOBAL_INTERACTION_STYLE_3D(state, style) {
      // TODO: it might be better for us to modify the views in an action
      // instead of a mutation
      // First, set the interaction style to all the views
      const allViews = this.state.proxyManager.getViews();
      allViews
        .filter((v) => v.getName() === 'default')
        .forEach((view) => {
          view.setPresetToInteractor3D(style);
        });

      // Now, modify the state
      state.interactionStyle3D = style;
    },
    GLOBAL_MAX_TEXTURE_LOD_SIZE(state, size) {
      state.maxTextureLODSize = size;
    },
  },
};
