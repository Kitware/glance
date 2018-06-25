export const DEFAULT_VIEW_TYPE = 'View3D:default';

export const VIEW_TYPES = [
  { text: 'View 3D', value: 'View3D:default' },
  { text: 'Orientation Y', value: 'View2D_Y:y' },
  { text: 'Orientation X', value: 'View2D_X:x' },
  { text: 'Orientation Z', value: 'View2D_Z:z' },
];

export const VIEW_TYPES_LPS = [
  { text: 'View 3D', value: 'View3D:default' },
  { text: 'Saggital', value: 'View2D_Y:y' },
  { text: 'Coronal', value: 'View2D_X:x' },
  { text: 'Axial', value: 'View2D_Z:z' },
];

export const VIEW_ORIENTATIONS = {
  default: {
    axis: 1,
    orientation: -1,
    viewUp: [0, 0, 1],
  },
  x: {
    axis: 0,
    orientation: 1,
    viewUp: [0, 0, 1],
  },
  y: {
    axis: 1,
    orientation: -1,
    viewUp: [0, 0, 1],
  },
  z: {
    axis: 2,
    orientation: -1,
    viewUp: [0, -1, 0],
  },
};
