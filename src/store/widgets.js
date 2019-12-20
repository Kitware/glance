import Vue from 'vue';

import {
  wrapMutationAsAction,
  remapIdKeys,
  remapIdList,
} from 'paraview-glance/src/utils';

export default () => ({
  namespaced: true,
  state: {
    measurements: {}, // dataset id -> [{component name, ...{measurement info}}]

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
    addMeasurementTool(state, { datasetId, componentName, data }) {
      if (!(datasetId in state.measurements)) {
        Vue.set(state.measurements, datasetId, []);
      }
      state.measurements[datasetId].push({
        componentName,
        data,
      });
    },
    updateMeasurementTool(state, { datasetId, index, data }) {
      if (datasetId in state.measurements) {
        Vue.set(state.measurements[datasetId][index], 'data', data);
      }
    },
    removeMeasurementTool(state, { datasetId, index }) {
      if (datasetId in state.measurements) {
        state.measurements[datasetId].splice(index, 1);
      }
    },
    rewriteProxyIds(state, idMapping) {
      state.measurements = remapIdKeys(state.measurements, idMapping);
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
    addMeasurementTool: wrapMutationAsAction('addMeasurementTool'),
    removeMeasurementTool: wrapMutationAsAction('removeMeasurementTool'),
    updateMeasurementTool: wrapMutationAsAction('updateMeasurementTool'),
    rewriteProxyIds: {
      root: true,
      handler: wrapMutationAsAction('rewriteProxyIds'),
    },
  },
});
