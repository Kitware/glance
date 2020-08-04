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

export default ({ proxyManager }) => ({
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
    interactionStyle3D: '3D',
    // The firstPersonMovementSpeed is the magnitude of the translation
    // in between animation frames while moving
    // If null, it will be calculated and set on first use
    firstPersonMovementSpeed: null,
    maxTextureLODSize: 50000, // Units are in KiB
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
    setInteractionStyle3D(state, style) {
      state.interactionStyle3D = style;
    },
    setFirstPersonMovementSpeed(state, speed) {
      state.firstPersonMovementSpeed = speed;
    },
    setMaxTextureLODSize(state, size) {
      state.maxTextureLODSize = size;
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
            // workaround for view not yet being mounted
            widgetManager.set({ useSvgLayer: false }, false, true);
            widgetManager.setRenderer(view.getRenderer());
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
    setInteractionStyle3D({ commit }, style) {
      proxyManager
        .getViews()
        .filter((v) => v.getName() === 'default')
        .forEach((view) => {
          view.setPresetToInteractor3D(style);
        });
      commit('setInteractionStyle3D', style);
    },
    setFirstPersonMovementSpeed({ commit }, speed) {
      const views = proxyManager
        .getViews()
        .filter((v) => v.getName() === 'default');
      views.forEach((view) => {
        const interactorStyle = view.getInteractorStyle3D();
        const manipulators = interactorStyle.getKeyboardManipulators();
        manipulators.forEach((manipulator) => {
          if (manipulator.setMovementSpeed) {
            manipulator.setMovementSpeed(speed);
          }
        });
      });

      commit('setFirstPersonMovementSpeed', speed);
    },
    resetFirstPersonMovementSpeed({ dispatch }) {
      let speed = 0;
      const views = proxyManager
        .getViews()
        .filter((v) => v.getName() === 'default');
      for (let i = 0; i < views.length; ++i) {
        const view = views[i];
        const interactorStyle = view.getInteractorStyle3D();
        const manipulators = interactorStyle.getKeyboardManipulators();
        for (let j = 0; j < manipulators.length; ++j) {
          const manipulator = manipulators[j];
          if (manipulator.resetMovementSpeed) {
            manipulator.setRenderer(view.getRenderer());
            manipulator.resetMovementSpeed();
            speed = manipulator.getMovementSpeed();
            break;
          }
        }
      }

      if (speed < 0) {
        speed = 0;
      }

      // Make sure all manipulators get updated
      dispatch('setFirstPersonMovementSpeed', speed);
    },
    setMaxTextureLODSize({ commit }, size) {
      commit('setMaxTextureLODSize', size);
    },
  },
});
