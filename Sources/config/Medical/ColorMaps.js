import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps';

import GenericColorMaps from '../Generic/ColorMaps';
import MedicalColorMaps from './ColorMaps.json';

// register medical colormaps
MedicalColorMaps.forEach((colorMap) => vtkColorMaps.addPreset(colorMap));

// extend the generic color maps with a medical category
GenericColorMaps.splice(0, 0, {
  Name: 'Medical',
  Category: true,
  Children: MedicalColorMaps,
});

export default GenericColorMaps;
