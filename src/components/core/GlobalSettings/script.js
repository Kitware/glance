import { mapState, mapActions } from 'vuex';

import AnimationControls from 'paraview-glance/src/components/widgets/AnimationControls';
import GpuInformation from 'paraview-glance/src/components/widgets/GPUInformation';
import PalettePicker from 'paraview-glance/src/components/widgets/PalettePicker';
import { BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';

const INTERACTION_STYLES_3D = [
  { text: 'Default', value: '3D' },
  { text: 'First Person', value: 'FirstPerson' },
];

const ORIENTATION_PRESETS = [
  { text: 'XYZ', value: 'default' },
  { text: 'LPS', value: 'lps' },
];

const AXIS_TYPES = [
  { text: 'Arrows', value: 'arrow' },
  { text: 'Cube', value: 'cube' },
];

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function getViewForVR() {
  const views = this.$proxyManager.getViews();
  for (let i = 0; i < views.length; i++) {
    if (views[i].getProxyName() === 'View3D') {
      return views[i];
    }
  }
  return null;
}

// ----------------------------------------------------------------------------

export default {
  name: 'GlobalSettings',
  components: {
    AnimationControls,
    PalettePicker,
    GpuInformation,
  },
  data() {
    return {
      palette: BACKGROUND,
      orientationPresets: ORIENTATION_PRESETS,
      interactionStyles3D: INTERACTION_STYLES_3D,
      axisTypes: AXIS_TYPES,
      vrEnabled: false,
      physicalScale: 1,
      basePhysicalScale: 1,
    };
  },
  computed: {
    distanceUnitSymbolModel: {
      get() {
        return this.distanceUnitSymbol;
      },
      set(symbol) {
        this.setDistanceUnitSymbol(symbol);
      },
    },
    distanceUnitFactorModel: {
      get() {
        return this.distanceUnitFactor;
      },
      set(factor) {
        this.setDistanceUnitFactor(factor);
      },
    },
    collapseDatasetPanelsModel: {
      get() {
        return this.collapseDatasetPanels;
      },
      set(v) {
        this.setCollapseDatasetPanels(v);
      },
    },
    backgroundColorModel: {
      get() {
        return this.backgroundColor;
      },
      set(color) {
        this.setBackgroundColor(color);
      },
    },
    orientationAxisModel: {
      get() {
        return this.orientationAxis;
      },
      set(flag) {
        this.setOrientationAxis(flag);
      },
    },
    orientationPresetModel: {
      get() {
        return this.orientationPreset;
      },
      set(preset) {
        this.setOrientationPreset(preset);
      },
    },
    axisTypeModel: {
      get() {
        return this.axisType;
      },
      set(axisType) {
        this.setAxisType(axisType);
      },
    },
    annotationOpacityModel: {
      get() {
        return this.annotationOpacity;
      },
      set(opacity) {
        this.setAnnotationOpacity(opacity);
      },
    },
    firstPersonMovementSpeedModel: {
      get() {
        let speed = this.firstPersonMovementSpeed;
        if (speed === null) {
          // Reset the speed if null
          this.resetFirstPersonMovementSpeed();
          speed = this.firstPersonMovementSpeed;
        }
        return speed;
      },
      set(speed) {
        this.setFirstPersonMovementSpeed(speed);
      },
    },
    interactionStyle3DModel: {
      get() {
        return this.interactionStyle3D;
      },
      set(style) {
        this.setInteractionStyle3D(style);
      },
    },
    firstPersonInteraction() {
      return this.interactionStyle3D === 'FirstPerson';
    },
    maxTextureLODSizeModel: {
      get() {
        return this.maxTextureLODSize;
      },
      set(size) {
        this.setMaxTextureLODSize(size);
      },
    },
    ...mapState(['collapseDatasetPanels']),
    ...mapState('animations', {
      isAnimated: (state) => state.frames.length > 0,
    }),
    ...mapState('views', {
      backgroundColor: (state) => state.globalBackgroundColor,
      orientationAxis: (state) => state.axisVisible,
      orientationPreset: (state) => state.axisPreset,
      axisType: (state) => state.axisType,
      annotationOpacity: (state) => state.annotationOpacity,
      interactionStyle3D: (state) => state.interactionStyle3D,
      firstPersonMovementSpeed: (state) => state.firstPersonMovementSpeed,
      maxTextureLODSize: (state) => state.maxTextureLODSize,
    }),
    ...mapState('widgets', {
      distanceUnitSymbol: (state) => state.distanceUnitSymbol,
      distanceUnitFactor: (state) => state.distanceUnitFactor,
    }),
  },
  watch: {
    physicalScale() {
      const view = this.getViewForVR();
      if (view) {
        view
          .getCamera()
          .setPhysicalScale(
            this.basePhysicalScale / Number(this.physicalScale)
          );
      }
    },
  },
  methods: {
    hasVR() {
      const view = this.getViewForVR();
      return view && !!view.getOpenGLRenderWindow().getVrDisplay();
    },
    getViewForVR,
    toggleVR(vr) {
      const view = this.getViewForVR();
      if (view) {
        const camera = view.getCamera();
        const renderer = view.getRenderer();
        const glRenderWindow = view.getOpenGLRenderWindow();
        if (vr) {
          view.setOrientationAxesVisibility(false);
          renderer.resetCamera();
          this.basePhysicalScale = camera.getPhysicalScale();
          this.physicalScale = 1;

          // ------------------------------------------------------------------
          // Reorient physical space
          // ------------------------------------------------------------------
          const unit = (v) => (v > 0 ? 1 : -1);
          const north = camera.getDirectionOfProjection();
          const northMax = Math.max(...north.map(Math.abs));
          camera.setPhysicalViewNorth(
            north.map((v) => (Math.abs(v) === northMax ? unit(v) : 0))
          );

          const up = camera.getViewUp();
          const upMax = Math.max(...up.map(Math.abs));
          camera.setPhysicalViewUp(
            up.map((v) => (Math.abs(v) === upMax ? unit(v) : 0))
          );
          // ------------------------------------------------------------------

          // Start VR finally
          glRenderWindow.startVR();
        } else {
          glRenderWindow.stopVR();
          view.setOrientationAxesVisibility(this.orientationAxis);
        }
      }
    },
    ...mapActions({
      setCollapseDatasetPanels: 'collapseDatasetPanels',
    }),
    ...mapActions('views', {
      setBackgroundColor: (dispatch, bg) => dispatch('setGlobalBackground', bg),
      setOrientationAxis: (dispatch, axis) => dispatch('setAxisVisible', axis),
      setOrientationPreset: (dispatch, preset) =>
        dispatch('setAxisPreset', preset),
      setAxisType: (dispatch, type) => dispatch('setAxisType', type),
      setAnnotationOpacity: (dispatch, opacity) =>
        dispatch('setAnnotationOpacity', opacity),
      setInteractionStyle3D: (dispatch, style) =>
        dispatch('setInteractionStyle3D', style),
      setFirstPersonMovementSpeed: (dispatch, speed) =>
        dispatch('setFirstPersonMovementSpeed', speed),
      resetFirstPersonMovementSpeed: (dispatch) =>
        dispatch('resetFirstPersonMovementSpeed'),
      setMaxTextureLODSize: (dispatch, size) =>
        dispatch('setMaxTextureLODSize', size),
    }),
    ...mapActions('widgets', {
      setDistanceUnitSymbol: (dispatch, symbol) =>
        dispatch('setDistanceUnitSymbol', symbol),
      setDistanceUnitFactor: (dispatch, factor) =>
        dispatch('setDistanceUnitFactor', factor),
    }),
  },
};
