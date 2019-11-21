import Vue from 'vue';

import { wrapMutationAsAction } from 'paraview-glance/src/utils';

export default () => ({
  namespaced: true,
  state: {
    // paint
    imageToLabelmaps: {}, // image id -> [labelmap ids]
    labelmapStates: {}, // labelmap id -> { selectedLabel, lastColorIndex }
  },
  mutations: {
    addLabelmapToImage(state, { imageId, labelmapId }) {
      if (!(imageId in state.imageToLabelmaps)) {
        Vue.set(state.imageToLabelmaps, imageId, []);
      }
      state.imageToLabelmaps[imageId].push(labelmapId);
    },
    setLabelmapState(state, { labelmapId, labelmapState }) {
      Vue.set(state.labelmapStates, labelmapId, labelmapState);
    },
  },
  actions: {
    addLabelmapToImage: wrapMutationAsAction('addLabelmapToImage'),
    setLabelmapState: wrapMutationAsAction('setLabelmapState'),
  },
});
