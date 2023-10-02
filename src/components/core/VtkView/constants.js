export const DEFAULT_VIEW_TYPE = 'View3D:default';

export const DEFAULT_AXIS_PRESET = 'default';

export const VIEW_TYPE_VALUES = {
  default: 'View3D:default',
  x: 'View2D_X:x',
  y: 'View2D_Y:y',
  z: 'View2D_Z:z',
};

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

export const DEFAULT_VIEW_TYPES = {
  [VIEW_TYPE_VALUES.default]: '3D',
  [VIEW_TYPE_VALUES.x]: 'Orientation X',
  [VIEW_TYPE_VALUES.y]: 'Orientation Y',
  [VIEW_TYPE_VALUES.z]: 'Orientation Z',
};

export const DEFAULT_LPS_VIEW_TYPES = {
  [VIEW_TYPE_VALUES.default]: '3D',
  [VIEW_TYPE_VALUES.x]: 'Sagittal',
  [VIEW_TYPE_VALUES.y]: 'Coronal',
  [VIEW_TYPE_VALUES.z]: 'Axial',
};

export const DEFAULT_VIEW_ORIENTATION = [1, 0, 0, 0, 1, 0, 0, 0, 1];
