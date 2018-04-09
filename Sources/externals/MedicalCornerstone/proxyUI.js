import GenericProxyUI from '../../config/Generic/proxyUI';

const Slice = [
  {
    name: 'visibility',
    label: 'Visibility',
    doc: 'Toggle visibility',
    widget: 'checkbox',
    type: 'boolean',
    advanced: 1,
    size: 1,
  },
  {
    label: 'Color Window',
    name: 'colorWindow',
    widget: 'slider',
    type: 'integer',
    size: 1,
    domain: { min: 0, max: 255, step: 1 },
  },
  {
    label: 'Color Level',
    name: 'colorLevel',
    widget: 'slider',
    type: 'integer',
    size: 1,
    domain: { min: 0, max: 255, step: 1 },
  },
  {
    label: 'Slice',
    name: 'slice',
    widget: 'slider',
    type: 'double',
    size: 1,
    domain: { min: 0, max: 255, step: 1 },
  },
  {
    name: 'interpolation',
    label: 'Pixel Interpolation',
    doc: 'Toggles pixel interpolation',
    widget: 'checkbox',
    type: 'boolean',
    advanced: 1,
    size: 1,
  },
  {
    name: 'hFlip',
    label: 'Flip Image Horizontal',
    doc: 'Flips the image horizontally',
    widget: 'checkbox',
    type: 'boolean',
    advanced: 1,
    size: 1,
  },
  {
    name: 'vFlip',
    label: 'Flip Image Vertical',
    doc: 'Flips the image vertically',
    widget: 'checkbox',
    type: 'boolean',
    advanced: 1,
    size: 1,
  },
  {
    name: 'invertColors',
    label: 'Invert colors',
    doc: 'Inverts colors in the image',
    widget: 'checkbox',
    type: 'boolean',
    advanced: 1,
    size: 1,
  },
];

export default {
  View3D: GenericProxyUI.View3D,
  Slice,
};
