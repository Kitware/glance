import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps';

import Presets from 'paraview-glance/src/config/Presets.json';

const defaultColorMaps = vtkColorMaps.rgbPresetNames.map(
  vtkColorMaps.getPresetByName
);

// sorts case insensitively
function comparator(a, b) {
  const s1 = a.Name.toLowerCase();
  const s2 = b.Name.toLowerCase();
  return s1 > s2 ? 1 : -(s1 < s2);
}

// register medical colormaps
function registerPresets(presets) {
  presets.forEach((preset) => {
    if (preset.Children) {
      registerPresets(preset.Children);
    } else {
      vtkColorMaps.addPreset(preset);
    }
  });
}

defaultColorMaps.sort(comparator);

// add custom presets
registerPresets(Presets);

export default [].concat(Presets, defaultColorMaps);
