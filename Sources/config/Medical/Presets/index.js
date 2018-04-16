import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps';

import GenericColorMaps from '../../Generic/ColorMaps';
import Presets from './Presets.json';

// register medical colormaps
function registerPresets(presets) {
  presets.forEach((preset) => {
    if (preset.Category) {
      registerPresets(preset.Children);
    } else {
      vtkColorMaps.addPreset(preset);
    }
  });
}
registerPresets(Presets);

// extend the generic color maps with a medical category
GenericColorMaps.splice(0, 0, {
  Name: 'Medical',
  Category: true,
  Children: Presets,
});

export default {
  MedicalPresets: Presets,
  ExtendedColorMaps: GenericColorMaps,
};
