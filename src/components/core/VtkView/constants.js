export const DEFAULT_VIEW_TYPE = 'View3D:default';

export const VIEW_TYPES = [
  { text: '3D', value: 'View3D:default' },
  { text: 'Orientation Y', value: 'View2D_Y:y' },
  { text: 'Orientation X', value: 'View2D_X:x' },
  { text: 'Orientation Z', value: 'View2D_Z:z' },
];

export const VIEW_TYPES_LPS = [
  { text: '3D', value: 'View3D:default' },
  { text: 'Sagittal', value: 'View2D_Y:y' },
  { text: 'Coronal', value: 'View2D_X:x' },
  { text: 'Axial', value: 'View2D_Z:z' },
];

/* eslint-disable  no-template-curly-in-string */
export const CURSOR_ANNOTATIONS = {
  se: '${valueArCursor}<br>${cursorIJK}&nbsp;/&nbsp;${cursorXYZ}<br>WL:&nbsp;${windowLevel}&nbsp;/&nbsp;WW:&nbsp;${windowWidth}',
};

export const ANNOTATIONS = {
  s: 'Image&nbsp;size:&nbsp;${sliceWidth}&nbsp;x&nbsp;${sliceHeight}',
  nw: 'Origin:&nbsp;${sliceOrigin}<br>Spacing:&nbsp;${sliceSpacing}&nbsp;mm<br>${sliceIndex}&nbsp;of&nbsp;${sliceCount}',
  se: 'WL:&nbsp;${windowLevel}&nbsp;/&nbsp;WW:&nbsp;${windowWidth}',
};
/* eslint-enable no-template-curly-in-string */

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
