import PiecewiseFunctionEditor from 'paraview-glance/src/components/widgets/PiecewiseFunctionEditor';
import PalettePicker from 'paraview-glance/src/components/widgets/PalettePicker';
import TreeView from 'paraview-glance/src/components/widgets/TreeView';
import { SPECTRAL } from 'paraview-glance/src/palette';
import Presets from 'paraview-glance/src/config/ColorMaps';

import vtkMath from 'vtk.js/Sources/Common/Core/Math';
import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps';
import PwfProxyConstants from 'vtk.js/Sources/Proxy/Core/PiecewiseFunctionProxy/Constants';

const { Mode: PwfMode } = PwfProxyConstants;

// ----------------------------------------------------------------------------
// Global helpers
// ----------------------------------------------------------------------------

const WORKING_CANVAS = document.createElement('canvas');
WORKING_CANVAS.setAttribute('width', 300);
WORKING_CANVAS.setAttribute('height', 1);

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

function setSolidColor(value) {
  const color = vtkMath.hex2float(value);
  const myRepresentations = this.proxyManager
    .getRepresentations()
    .filter((r) => r.getInput() === this.source);
  for (let i = 0; i < myRepresentations.length; i++) {
    myRepresentations[i].setColor(...color);
  }
  this.proxyManager.renderAllViews();
  this.solidColor = value;
}

// ----------------------------------------------------------------------------

function setPreset() {
  this.applyColorMap();
  this.applyOpacity();
  this.updateLookupTableImage();
  this.proxyManager.renderAllViews();
}

// ----------------------------------------------------------------------------

function setColorBy(value) {
  if (this.available === 'volume') {
    this.updateLookupTableImage();
    return;
  }

  const args = value.split(':');
  const myRepresentations = this.proxyManager
    .getRepresentations()
    .filter((r) => r.getInput() === this.source);
  for (let i = 0; i < myRepresentations.length; i++) {
    myRepresentations[i].setColorBy(...args);
    this.dataRange = myRepresentations[i].getDataArray().getRange();
  }
  this.proxyManager.renderAllViews();

  // Update lutImage
  if (args.length) {
    this.updateLookupTableImage();
  }
}

// ----------------------------------------------------------------------------

function applyOpacity() {
  const arrayName = this.colorBy.split(':')[0];
  const pwfProxy = this.proxyManager.getPiecewiseFunction(arrayName);
  const preset = vtkColorMaps.getPresetByName(this.presetName);

  if (this.usePresetOpacity && preset && preset.OpacityPoints) {
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
}

// ----------------------------------------------------------------------------

function applyColorMap() {
  const arrayName = this.colorBy.split(':')[0];
  const lutProxy = this.proxyManager.getLookupTable(arrayName);
  lutProxy.setPresetName(this.presetName);

  if (this.usePresetOpacity) {
    let [min, max] = this.shiftRange;
    min += this.shift;
    max += this.shift;
    lutProxy.setDataRange(min, max);
  } else {
    lutProxy.setDataRange(...this.dataRange);
  }
}

// ----------------------------------------------------------------------------

function updateLookupTableImage() {
  const arrayName = this.colorBy.split(':')[0];
  const lutProxy = this.proxyManager.getLookupTable(arrayName);
  this.lutImage = getLookupTableImage(
    lutProxy.getLookupTable(),
    ...lutProxy.getDataRange(),
    256
  );
  this.presetName = lutProxy.getPresetName();

  this.piecewiseFunction = this.proxyManager.getPiecewiseFunction(arrayName);
}

// ----------------------------------------------------------------------------

function convertArrays(arrays, addSolidColor = false) {
  const options = [];
  if (addSolidColor) {
    options.push({ text: 'Solid color', value: '' });
  }
  for (let i = 0; i < arrays.length; i++) {
    const item = arrays[i];
    options.push({
      text: item.name,
      value: `${item.name}:${item.location}`,
    });
  }
  return options;
}

// ----------------------------------------------------------------------------

function onChangePreset(preset) {
  if (preset) {
    this.presetName = preset.Name;
  }
  this.presetMenu = false;
}

// ----------------------------------------------------------------------------

// Used to close the color preset dropdown menu
function onEsc(ev) {
  // ESC key
  if (ev.keyCode === 27) {
    this.presetMenu = false;
  }
}

// ----------------------------------------------------------------------------
// Add custom method
// ----------------------------------------------------------------------------

export default {
  inject: ['proxyManager'],
  props: ['source'],
  components: {
    PalettePicker,
    PiecewiseFunctionEditor,
    TreeView,
  },
  data() {
    return {
      palette: SPECTRAL.concat('#ffffff'),
      available: '',
      colorBy: '',
      arrays: [{ text: 'Solid color', value: '' }],
      arrayName: '',
      piecewiseFunction: null,
      solidColor: '#ffffff',
      lutImage: '',
      presetName: '',
      presets: Presets,
      presetMenu: false,
      shift: 0, // simple transfer function shift
      dataRange: [0, 0],
    };
  },
  computed: {
    usePresetOpacity() {
      const preset = vtkColorMaps.getPresetByName(this.presetName);
      return preset && preset.OpacityPoints;
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
    colorBy: setColorBy,
    presetName() {
      if (this.shift) {
        // changing shift value will call setPreset()
        this.shift = 0;
      } else {
        this.setPreset();
      }
    },
    shift: setPreset,
    usePresetOpacity(value) {
      const arrayName = this.colorBy.split(':')[0];
      const pwfProxy = this.proxyManager.getPiecewiseFunction(arrayName);
      if (value) {
        pwfProxy.setMode(PwfMode.Points);
      } else {
        pwfProxy.setMode(PwfMode.Gaussians);
      }
    },
  },
  methods: {
    onChangePreset,
    onEsc,
    setSolidColor,
    setPreset,
    applyOpacity,
    applyColorMap,
    updateLookupTableImage,
  },
  mounted() {
    const myRepresentations = this.proxyManager
      .getRepresentations()
      .filter((r) => r.getInput() === this.source);
    if (myRepresentations.length) {
      const repGeometry = myRepresentations.find(
        (r) => r.getProxyName() === 'Geometry'
      );
      const repVolume = myRepresentations.find(
        (r) => r.getProxyName() === 'Volume'
      );
      if (repGeometry) {
        const colorByValue = repGeometry.getColorBy();
        this.arrayName = colorByValue[0];
        this.colorBy = colorByValue.join(':');
        const propUI = repGeometry
          .getReferenceByName('ui')
          .find((item) => item.name === 'colorBy');
        if (propUI) {
          this.arrays = convertArrays(propUI.domain.arrays, true);
        }
        this.available = 'geometry';
      }
      if (repVolume) {
        this.available = 'volume';
        const colorByValue = repVolume.getColorBy();
        this.arrayName = colorByValue[0];
        this.colorBy = colorByValue.join(':');
        this.dataRange = repVolume.getDataArray().getRange();
        const propUI = repVolume
          .getReferenceByName('ui')
          .find((item) => item.name === 'colorBy');
        if (propUI) {
          this.arrays = convertArrays(propUI.domain.arrays);
        }
      }
    }

    document.addEventListener('keyup', this.onEsc);
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.onEsc);
  },
};
