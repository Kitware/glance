import macro from 'vtk.js/Sources/macro';
import vtkMath from 'vtk.js/Sources/Common/Core/Math';
import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps';
import PwfProxyConstants from 'vtk.js/Sources/Proxy/Core/PiecewiseFunctionProxy/Constants';

import PiecewiseFunctionEditor from 'paraview-glance/src/components/widgets/PiecewiseFunctionEditor';
import PalettePicker from 'paraview-glance/src/components/widgets/PalettePicker';
import TreeView from 'paraview-glance/src/components/widgets/TreeView';
import { SPECTRAL } from 'paraview-glance/src/palette';
import Presets from 'paraview-glance/src/config/ColorMaps';

const { Mode: PwfMode } = PwfProxyConstants;

const SOLID_COLOR = { text: 'Solid color', value: 'solid' };

// ----------------------------------------------------------------------------
// Global helpers
// ----------------------------------------------------------------------------

const WORKING_CANVAS = document.createElement('canvas');
WORKING_CANVAS.setAttribute('width', 300);
WORKING_CANVAS.setAttribute('height', 1);

// ----------------------------------------------------------------------------

function getLookupTableImage(lut, min, max, width) {
  WORKING_CANVAS.setAttribute('width', width);
  const ctx = WORKING_CANVAS.getContext('2d');
  const rawData = lut.getUint8Table(min, max, width, true);
  const pixelsArea = ctx.getImageData(0, 0, width, 1);
  pixelsArea.data.set(rawData);
  ctx.putImageData(pixelsArea, 0, 0);
  return WORKING_CANVAS.toDataURL('image/jpg');
}

// ----------------------------------------------------------------------------

function convertArrays(arrays, addSolidColor = false) {
  const options = [];
  if (addSolidColor) {
    options.push(SOLID_COLOR);
  }
  for (let i = 0; i < arrays.length; i++) {
    const item = arrays[i];
    options.push({
      text: item.name,
      value: `${item.name}--:|:--${item.location}`,
    });
  }
  return options;
}

// ----------------------------------------------------------------------------
// Add custom method
// ----------------------------------------------------------------------------

export default {
  name: 'ColorBy',
  props: ['sourceId'],
  components: {
    PalettePicker,
    PiecewiseFunctionEditor,
    TreeView,
  },
  data() {
    return {
      palette: SPECTRAL.concat('#ffffff', '#000000'),
      available: '',
      colorBy: 'solid',
      arrays: [SOLID_COLOR],
      arrayName: '',
      piecewiseFunction: null,
      solidColor: '#ffffff',
      lutImage: '',
      presetName: '',
      presets: Presets,
      presetMenu: false,
      shift: 0, // simple transfer function shift
      dataRange: [0, 0],
      origDataRange: [0, 0],
      interpolateScalarsBeforeMapping: true,
      colorToSlices: false,
      opacityToSlices: false,
    };
  },
  computed: {
    source() {
      return this.$proxyManager.getProxyById(this.sourceId);
    },
    colorByName() {
      if (this.colorBy.indexOf('--:|:--') === -1) {
        return null;
      }
      const cb = this.colorBy.split('--:|:--');
      return cb[0];
    },
    colorByLocation() {
      if (this.colorBy.indexOf('--:|:--') === -1) {
        return null;
      }
      const cb = this.colorBy.split('--:|:--');
      return cb[1];
    },
    hasPresetOpacity() {
      const preset = vtkColorMaps.getPresetByName(this.presetName);
      return Boolean(preset && preset.OpacityPoints);
    },
    shiftRange() {
      const preset = vtkColorMaps.getPresetByName(this.presetName);
      if (preset) {
        // shift range is original rgb/opacity range centered around 0
        let min = Infinity;
        let max = -Infinity;
        for (let i = 0; i < preset.RGBPoints.length; i += 4) {
          min = Math.min(min, preset.RGBPoints[i]);
          max = Math.max(max, preset.RGBPoints[i]);
        }

        const center = (max - min) / 2;
        return [-center, center];
      }
      return [0, 0];
    },
  },
  watch: {
    interpolateScalarsBeforeMapping(value) {
      this.updateRepProperty('interpolateScalarsBeforeMapping', value);
    },
    colorBy() {
      if (this.available === 'geometry') {
        const myReps = this.$proxyManager
          .getRepresentations()
          .filter((r) => r.getInput() === this.source);
        for (let i = 0; i < myReps.length; i++) {
          myReps[i].setColorBy(this.colorByName, this.colorByLocation);

          // why are we updating dataRange and interpolateScalarsBeforeMapping here?
          const dataArray = myReps[i].getDataArray();
          // solid coloring doesn't have a valid data array
          if (dataArray) {
            const dataRange = dataArray.getRange();
            this.dataRange = dataRange; // We want to keep the current range
            this.origDataRange = [...dataRange]; // copy
          }
          // Update interpolateScalarsBeforeMapping
          this.interpolateScalarsBeforeMapping = myReps[
            i
          ].getInterpolateScalarsBeforeMapping();
        }
        this.$proxyManager.renderAllViews();
        this.setPreset();
      }

      // Update lutImage
      if (this.colorByName) {
        this.updateLookupTableImage();
      }
    },
    solidColor(value) {
      const color = vtkMath.hex2float(value);
      this.updateRepProperty('color', ...color);
    },
    presetName() {
      this.renderPreset();
    },
    shift() {
      this.renderPreset();
    },
    hasPresetOpacity(value) {
      const arrayName = this.colorByName;
      const pwfProxy = this.$proxyManager.getPiecewiseFunction(arrayName);
      if (value) {
        pwfProxy.setMode(PwfMode.Points);
      } else {
        pwfProxy.setMode(PwfMode.Gaussians);
      }
    },
    dataRange() {
      for (let i = 0; i < 2; i++) {
        this.dataRange[i] = Number(this.dataRange[i] || 0);
      }
      this.applyColorMap();
    },
  },
  proxyManagerHooks: {
    onProxyRegistrationChange({ proxyGroup }) {
      if (proxyGroup === 'Representations') {
        this.update();
      }
    },
  },
  mounted() {
    document.addEventListener('keyup', this.onEsc);
    this.$nextTick(this.update);
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.onEsc);
    // while (this.subscriptions.length) {
    //   this.subscriptions.pop().unsubscribe();
    // }
  },
  methods: {
    updateRepProperty(fieldName, ...args) {
      const methodName = `set${macro.capitalize(fieldName)}`;
      const myRepresentations = this.$proxyManager
        .getRepresentations()
        .filter((r) => r.getInput() === this.source);
      for (let i = 0; i < myRepresentations.length; i++) {
        if (myRepresentations[i][methodName]) {
          myRepresentations[i][methodName](...args);
        }
      }
      this.$proxyManager.renderAllViews();
    },
    onChangePreset(preset) {
      if (preset) {
        this.presetName = preset.Name;
        // reset shift value when preset has opacity points
        if (this.hasPresetOpacity) {
          this.shift = 0;
        }
      }
      this.presetMenu = false;
    },
    // Used to close the color preset dropdown menu
    onEsc(ev) {
      // ESC key
      if (ev.keyCode === 27) {
        this.presetMenu = false;
      }
    },
    renderPreset() {
      this.applyColorMap();
      this.applyOpacity();
      this.updateLookupTableImage();
      this.$proxyManager.renderAllViews();
    },
    applyOpacity() {
      const arrayName = this.colorByName;
      const pwfProxy = this.$proxyManager.getPiecewiseFunction(arrayName);
      const preset = vtkColorMaps.getPresetByName(this.presetName);

      if (this.hasPresetOpacity && preset && preset.OpacityPoints) {
        const points = [];
        for (let i = 0; i < preset.OpacityPoints.length; i += 2) {
          points.push([preset.OpacityPoints[i], preset.OpacityPoints[i + 1]]);
        }

        // shift range is range of OpacityPoints' "x" coordinate
        let [min, max] = this.shiftRange;
        const width = max - min;
        const normPoints = points.map(([x, y]) => [(x - min) / width, y]);
        pwfProxy.setPoints(normPoints);

        min += this.shift;
        max += this.shift;
        pwfProxy.setDataRange(min, max);
      } else {
        pwfProxy.setDataRange(...this.dataRange);
      }
    },
    applyColorMap() {
      const arrayName = this.colorByName;
      const lutProxy = this.$proxyManager.getLookupTable(arrayName);
      lutProxy.setPresetName(this.presetName);

      if (this.hasPresetOpacity) {
        let [min, max] = this.shiftRange;
        min += this.shift;
        max += this.shift;
        lutProxy.setDataRange(min, max);
      } else {
        lutProxy.setDataRange(...this.dataRange);
      }
    },
    updateLookupTableImage() {
      const arrayName = this.colorByName;
      const lutProxy = this.$proxyManager.getLookupTable(arrayName);
      this.lutImage = getLookupTableImage(
        lutProxy.getLookupTable(),
        ...lutProxy.getDataRange(),
        256
      );

      this.piecewiseFunction = this.$proxyManager.getPiecewiseFunction(
        arrayName
      );
    },
    setPreset() {
      if (this.arrayName) {
        const lutProxy = this.$proxyManager.getLookupTable(this.arrayName);
        this.presetName = lutProxy.getPresetName();
        // hasPresetOpacity is derived from presetName
        if (this.hasPresetOpacity) {
          const pwfProxy = this.$proxyManager.getPiecewiseFunction(
            this.arrayName
          );
          // compute shift based on saved pwfProxy data range
          const pwfRange = pwfProxy.getDataRange();
          this.shift = pwfRange[0] - this.shiftRange[0];
        }
      }
    },
    update() {
      const myRepresentations = this.$proxyManager
        .getRepresentations()
        .filter((r) => r.getInput() === this.source);
      if (myRepresentations.length) {
        const repGeometry = myRepresentations.find(
          (r) => r.getProxyName() === 'Geometry'
        );
        const repVolume = myRepresentations.find(
          (r) => r.getProxyName() === 'Volume'
        );
        const repSliceX = myRepresentations.find(
          (r) => r.getProxyName() === 'SliceX'
        );

        if (repGeometry) {
          this.available = 'geometry';
        } else if (repVolume) {
          this.available = 'volume';
        } else {
          this.available = '';
          return;
        }

        const rep = repGeometry || repVolume;
        const colorByValue = rep.getColorBy();

        this.arrayName = colorByValue[0];

        // only get name and location of colorBy array
        if (colorByValue.length) {
          this.colorBy = colorByValue.slice(0, 2).join('--:|:--');
        } else {
          // should only happen with geometry
          this.colorBy = 'solid';
        }

        const propUI = rep
          .getReferenceByName('ui')
          .find((item) => item.name === 'colorBy');
        if (propUI) {
          this.arrays = convertArrays(
            propUI.domain.arrays,
            this.available === 'geometry'
          );
        }

        if (rep.getDataArray()) {
          this.origDataRange = rep.getDataArray().getRange();
        }

        if (this.available === 'geometry') {
          this.solidColor = vtkMath.floatRGB2HexCode(repGeometry.getColor());
        }

        if (repSliceX) {
          this.colorToSlices = repSliceX.getUseColorByForColor();
          this.opacityToSlices = repSliceX.getUseColorByForOpacity();
          this.applyFuncsToSlices({
            color: this.colorToSlices,
            opacity: this.opacityToSlices,
          });
        }
      }

      this.setPreset();

      // set data range
      if (this.arrayName) {
        const lutProxy = this.$proxyManager.getLookupTable(this.arrayName);
        this.dataRange = lutProxy.getDataRange();
      }
    },
    setRange(index, value) {
      const v = Number.parseFloat(value);
      if (!Number.isNaN(v)) {
        const newRange = [...this.dataRange];
        newRange[index] = value;
        if (newRange[0] < newRange[1]) {
          this.dataRange = newRange;
        }
      }
    },
    resetDataRange() {
      this.dataRange = this.origDataRange.slice();
      this.$proxyManager.renderAllViews();
    },
    applyColorToSlices(color) {
      this.applyFuncsToSlices({ color: !!color });
    },
    applyOpacityToSlices(opacity) {
      this.applyFuncsToSlices({ opacity: !!opacity });
    },
    applyFuncsToSlices({ color, opacity }) {
      this.colorToSlices = color ?? this.colorToSlices;
      this.opacityToSlices = opacity ?? this.opacityToSlices;

      const reps = this.$proxyManager
        .getRepresentations()
        .filter((r) => r.getInput() === this.source);

      const sliceRep = reps.find((r) =>
        r.isA('vtkCustomSliceRepresentationProxy')
      );
      if (sliceRep) {
        // proxy links will handle syncing slices
        sliceRep.setUseColorByForColor(this.colorToSlices);
        sliceRep.setUseColorByForOpacity(this.opacityToSlices);
      }

      this.$proxyManager.renderAllViews();
    },
  },
};
