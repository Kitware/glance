import PalettePicker from 'paraview-glance/src/components/core/PalettePicker';
import { BACKGROUND } from 'paraview-glance/src/components/core/VtkView/palette';

import vtkMath from 'vtk.js/Sources/Common/Core/Math';
import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps';

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
}

// ----------------------------------------------------------------------------

function setPreset(value) {
  const arrayName = this.colorBy.split(':')[0];
  const lutProxy = this.proxyManager.getLookupTable(arrayName);
  lutProxy.setPresetName(value);
  this.proxyManager.renderAllViews();
  this.updateLookupTableImage();
}

// ----------------------------------------------------------------------------

function setColorBy(value) {
  const args = value.split(':');
  const myRepresentations = this.proxyManager
      .getRepresentations()
      .filter((r) => r.getInput() === this.source);
  for (let i = 0; i < myRepresentations.length; i++) {
    myRepresentations[i].setColorBy(...args);
  }
  this.proxyManager.renderAllViews();

  // Update lutImage
  if (args.length) {
    this.updateLookupTableImage();
  }
}

// ----------------------------------------------------------------------------

function updateLookupTableImage() {
  const arrayName = this.colorBy.split(':')[0];
  const lutProxy = this.proxyManager.getLookupTable(arrayName);
  this.lutImage = getLookupTableImage(lutProxy.getLookupTable(), ...lutProxy.getDataRange(), 256);
  this.presetName = lutProxy.getPresetName();
}

// ----------------------------------------------------------------------------

function convertArrays(arrays) {
  const options = [
    { text: 'Solid color', value: '' },
  ];
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
// Add custom method
// ----------------------------------------------------------------------------

export default {
  inject: ['proxyManager'],
  props: ['source'],
  components: {
    PalettePicker,
  },
  data() {
    return {
      palette: BACKGROUND,
      available: false,
      colorBy: '',
      arrays: [
        { text: 'Solid color', value: '' },
      ],
      lutImage: '',
      presetName: '',
      presets: vtkColorMaps.rgbPresetNames.map((name) => ({ text: name, value: name })),
    };
  },
  watch: {
    colorBy: setColorBy,
    presetName: setPreset,
  },
  methods: {
    setSolidColor,
    setPreset,
    updateLookupTableImage,
  },
  mounted() {
    const myRepresentations = this.proxyManager
      .getRepresentations()
      .filter((r) => r.getInput() === this.source);
    if (myRepresentations.length) {
      const rep = myRepresentations[0];
      if (rep.getProxyName() === 'Geometry') {
        const colorByValue = rep.getColorBy();
        console.log('colorByValue', colorByValue);
        this.colorBy = colorByValue.join(':');
        const propUI = rep.getReferenceByName('ui').find((item) => item.name === 'colorBy');
        if (propUI) {
          this.arrays = convertArrays(propUI.domain.arrays);
        }
        this.available = true;
      }
    }
  },
};
