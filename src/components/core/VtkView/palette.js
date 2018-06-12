import { SPECTRAL } from 'paraview-glance/src/palette';

// Specifications for vtkview background colors, images, and gradients
export const BACKGROUND = [
  '#000000',
  '#ffffff',
  ...SPECTRAL,
  'linear-gradient(#7478BE, #C1C3CA)', // from 3D Slicer default
  'linear-gradient(#333, #eee)',
  'linear-gradient(#00002A, #52576E)', // from ParaView
];

export default {
  BACKGROUND,
};
