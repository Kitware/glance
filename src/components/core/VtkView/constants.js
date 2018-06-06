export const DEFAULT_VIEW_TYPE = 'View3D:default';

export const VIEW_TYPES = [
  { text: 'View 3D', value: 'View3D:default' },
  { text: 'Orientation X', value: 'View2D_X:x' },
  { text: 'Orientation Y', value: 'View2D_Y:y' },
  { text: 'Orientation Z', value: 'View2D_Z:z' },
];

export const VIEW_ORIENTATIONS = {
  default: {
    axis: 2,
    orientation: 1,
    viewUp: [0, -1, 0],
  },
  x: {
    axis: 0,
    orientation: 1,
    viewUp: [0, -1, 0],
  },
  y: {
    axis: 1,
    orientation: 1,
    viewUp: [0, 0, 1],
  },
  z: {
    axis: 2,
    orientation: 1,
    viewUp: [0, -1, 0],
  },
};
