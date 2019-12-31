import Vue from 'vue';
import vtkWidgetManager from 'vtk.js/Sources/Widgets/Core/WidgetManager';
import WidgetManagerConstants from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';

import {
  DEFAULT_VIEW_TYPE,
  VIEW_TYPES,
  VIEW_ORIENTATIONS,
} from 'paraview-glance/src/components/core/VtkView/constants';
import { DEFAULT_BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';

const { CaptureOn } = WidgetManagerConstants;

export default (proxyManager) => ({
  namespaced: true,
  state: {
    viewsInitialized: false,
    viewTypeToId: {}, // viewType -> view ID
    backgroundColors: {}, // viewType -> bg
    globalBackgroundColor: DEFAULT_BACKGROUND,
    axisType: 'arrow',
    axisPreset: 'default',
    axisVisible: true,
    annotationOpacity: 1,
    viewOrder: VIEW_TYPES.map((v) => v.value),
    visibleCount: 1,
  },
  mutations: {
    setGlobalBackground(state, background) {
      // if global bg color changes, then all bgs change.
      state.globalBackgroundColor = background;
      const keys = Object.keys(state.backgroundColors);
      for (let i = 0; i < keys.length; i++) {
        state.backgroundColors[keys[i]] = background;
      }
    },
    setAxisType(state, type) {
      state.axisType = type;
    },
    setAxisPreset(state, preset) {
      state.axisPreset = preset;
    },
    setAxisVisible(state, visible) {
      state.axisVisible = visible;
    },
    setAnnotationOpacity(state, opacity) {
      state.annotationOpacity = opacity;
    },
    mapViewTypeToId(state, { viewType, viewId }) {
      Vue.set(state.viewTypeToId, viewType, viewId);
    },
    changeBackground(state, { viewType, color }) {
      state.backgroundColors[viewType] = color;
    },
    viewsInitialized(state) {
      state.viewsInitialized = true;
    },
    visibleCount(state, count) {
      state.visibleCount = count;
    },
    swapViews(state, { index, viewType }) {
      // swap target view index with viewType view
      const dstIndex = state.viewOrder.indexOf(viewType);
      const srcViewType = state.viewOrder[index];
      Vue.set(state.viewOrder, index, viewType);
      Vue.set(state.viewOrder, dstIndex, srcViewType);
    },
  },
  actions: {
    initViews({ commit, state }) {
      if (!state.viewsInitialized) {
        commit('viewsInitialized');

        let defaultView = null;
        state.viewOrder.forEach((viewType) => {
          const [type, name] = viewType.split(':');
          const view = proxyManager.createProxy('Views', type, { name });

          // Update orientation
          const { axis, orientation, viewUp } = VIEW_ORIENTATIONS[name];
          view.updateOrientation(axis, orientation, viewUp);

          // set background to transparent
          view.setBackground(0, 0, 0, 0);
          // set actual background from global bg color
          Vue.set(
            state.backgroundColors,
            viewType,
            state.globalBackgroundColor
          );

          view.setPresetToOrientationAxes('default');

          if (!view.getReferenceByName('widgetManager')) {
            const widgetManager = vtkWidgetManager.newInstance();
            widgetManager.setCaptureOn(CaptureOn.MOUSE_MOVE);
            view.set({ widgetManager }, true);
          }

          if (viewType === DEFAULT_VIEW_TYPE) {
            defaultView = view;
          }

          commit('mapViewTypeToId', {
            viewType,
            viewId: view.getProxyId(),
          });
        });

        if (defaultView) {
          defaultView.activate();
        }
      }
    },
    swapViews({ commit }, { index, viewType }) {
      commit('swapViews', { index, viewType });
    },
    singleView({ state, commit }, index) {
      commit('swapViews', {
        index: 0,
        viewType: state.viewOrder[index],
      });
      commit('visibleCount', 1);
    },
    splitView({ state, commit }, index) {
      commit('swapViews', {
        index,
        viewType: state.viewOrder[1],
      });
      commit('visibleCount', 2);
    },
    quadView({ commit }) {
      commit('visibleCount', 4);
    },
    setGlobalBackground({ commit }, background) {
      commit('setGlobalBackground', background);
    },
    changeBackground({ commit }, { viewType, color }) {
      commit('changeBackground', { viewType, color });
    },
    setAxisType({ commit }, axisType) {
      proxyManager.getViews().forEach((view) => {
        view.setOrientationAxesType(axisType);
      });
      commit('setAxisType', axisType);
    },
    setAxisPreset({ commit }, axisPreset) {
      proxyManager.getViews().forEach((view) => {
        view.setPresetToOrientationAxes(axisPreset);
      });
      commit('setAxisPreset', axisPreset);
    },
    setAxisVisible({ commit }, visible) {
      proxyManager.getViews().forEach((view) => {
        view.setOrientationAxesVisibility(visible);
      });
      commit('setAxisVisible', visible);
    },
    setAnnotationOpacity({ commit }, opacity) {
      proxyManager.getViews().forEach((view) => {
        view.setAnnotationOpacity(opacity);
      });
      commit('setAnnotationOpacity', opacity);
    },
  },
});
