import { SPECTRAL } from 'paraview-glance/src/palette';

export const DEFAULT_BACKGROUND = 'linear-gradient(#333, #999)';

// Specifications for vtkview background colors, images, and gradients
export const BACKGROUND = [
  '#000000',
  '#ffffff',
  ...SPECTRAL,
  'linear-gradient(#7478BE, #C1C3CA)', // from 3D Slicer default
  'linear-gradient(#00002A, #52576E)', // from ParaView
  DEFAULT_BACKGROUND,
];

export default {
  BACKGROUND,
  DEFAULT_BACKGROUND,
};
