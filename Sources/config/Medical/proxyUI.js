import Presets from './Presets';

const Volume = [
  {
    label: 'Color By',
    propType: 'colorBy',
    name: 'colorBy',
    type: 'str',
    advanced: 0,
    size: 3,
    domain: {},
    doc: 'Array to color by',
  },
  {
    label: 'Display Preset',
    propType: 'presetProperty',
    name: 'piecewiseFunctionProxy',
    advanced: 0,
    size: 1,
    domain: {
      presets: Presets.MedicalPresets,
    },
    doc: 'Opacity and transfer function presets',
  },
  {
    label: 'Lookup Table Editor',
    propType: 'lookupTableProperty',
    name: 'lookupTableProxy',
    advanced: 1,
    size: 1,
    domain: {
      colormaps: Presets.ExtendedColorMaps,
    },
    doc: 'Edit lookup table',
  },
  // Disable this until we add in a non-gaussian
  // piecewise function editor.
  // {
  //   label: 'Piecewise Function Editor',
  //   propType: 'piecewiseFunctionProperty',
  //   name: 'piecewiseFunctionProxy',
  //   advanced: 1,
  //   size: 1,
  //   domain: {},
  //   doc: 'Edit piecewise function',
  // },
  {
    name: 'volumeVisibility',
    label: 'Volume Visibility',
    doc: 'Toggle visibility of the Volume',
    widget: 'checkbox',
    type: 'boolean',
    advanced: 1,
    size: 1,
  },
  {
    widget: 'PropertyGroup', // 'ProxyEditorPropertyWidget',
    label: 'Shadow and Edge',
    name: 'groupShadowEdge',
    type: null,
    children: [
      {
        name: 'useShadow',
        label: 'Use shadow',
        doc: 'Toggle shadow for volume rendering',
        widget: 'checkbox',
        type: 'boolean',
        size: 1,
      },
      {
        label: 'Sample distance',
        name: 'sampleDistance',
        widget: 'slider',
        type: 'double',
        size: 1,
        domain: { min: 0, max: 1, step: 0.01 },
      },
      {
        label: 'Edge Gradient',
        name: 'edgeGradient',
        widget: 'slider',
        type: 'double',
        size: 1,
        domain: { min: 0, max: 1, step: 0.01 },
      },
    ],
  },
  {
    widget: 'PropertyGroup', // 'ProxyEditorPropertyWidget',
    label: 'Window setup',
    name: 'groupWindow',
    type: null,
    children: [
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
    ],
  },
  {
    widget: 'PropertyGroup', // 'ProxyEditorPropertyWidget',
    label: 'Slices',
    name: 'groupSlices',
    type: null,
    children: [
      {
        name: 'sliceVisibility',
        label: 'Slices Visibility',
        doc: 'Toggle visibility of the Slices',
        widget: 'checkbox',
        type: 'boolean',
        size: 1,
      },
      {
        label: 'SliceX',
        name: 'xSlice',
        widget: 'slider',
        type: 'integer',
        size: 1,
        domain: { min: 0, max: 255, step: 1 },
      },
      {
        label: 'SliceY',
        name: 'ySlice',
        widget: 'slider',
        type: 'integer',
        size: 1,
        domain: { min: 0, max: 255, step: 1 },
      },
      {
        label: 'SliceZ',
        name: 'zSlice',
        widget: 'slider',
        type: 'integer',
        size: 1,
        domain: { min: 0, max: 255, step: 1 },
      },
    ],
  },
];

export default {
  Volume,
};
