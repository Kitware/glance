import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps';

const colorMaps = vtkColorMaps.rgbPresetNames.map(vtkColorMaps.getPresetByName);

// sorts case insensitively
function comparator(a, b) {
  const s1 = a.Name.toLowerCase();
  const s2 = b.Name.toLowerCase();
  return s1 > s2 ? 1 : -(s1 < s2);
}

colorMaps.sort(comparator);

export default colorMaps;
