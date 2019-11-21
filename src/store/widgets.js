import Vue from 'vue';

import {
  wrapMutationAsAction,
  remapIdKeys,
  remapIdList,
} from 'paraview-glance/src/utils';

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
    rewriteProxyIds(state, idMapping) {
      state.imageToLabelmaps = remapIdKeys(state.imageToLabelmaps, idMapping);
      state.labelmapStates = remapIdKeys(state.labelmapStates, idMapping);

      Object.keys(state.imageToLabelmaps).forEach((id) => {
        state.imageToLabelmaps[id] = remapIdList(
          state.imageToLabelmaps[id],
          idMapping
        );
      });
    },
  },
  actions: {
    addLabelmapToImage: wrapMutationAsAction('addLabelmapToImage'),
    setLabelmapState: wrapMutationAsAction('setLabelmapState'),
    rewriteProxyIds: {
      root: true,
      handler: wrapMutationAsAction('rewriteProxyIds'),
    },
  },
});
