import ColorMaps from 'paraview-glance/src/config/ColorMaps';

const Volume = [
  {
    name: 'colorBy',
    domain: {},
  },
  {
    name: 'lookupTableProxy',
    domain: { colormaps: ColorMaps },
  },
  {
    name: 'piecewiseFunctionProxy',
    domain: {},
  },
  {
    name: 'volumeVisibility',
  },
  {
    name: 'useShadow',
  },
  {
    name: 'sampleDistance',
    domain: { min: 0, max: 1, step: 0.01 },
  },
  {
    name: 'edgeGradient',
    domain: { min: 0, max: 1, step: 0.01 },
  },
  {
    name: 'colorWindow',
    domain: { min: 0, max: 255, step: 1 },
  },
  {
    name: 'colorLevel',
    domain: { min: 0, max: 255, step: 1 },
  },
  {
    name: 'sliceVisibility',
  },
  {
    name: 'xSlice',
    domain: { min: 0, max: 255, step: 1 },
  },
  {
    name: 'ySlice',
    domain: { min: 0, max: 255, step: 1 },
  },
  {
    name: 'zSlice',
    domain: { min: 0, max: 255, step: 1 },
  },
];

const Geometry = [
  {
    name: 'colorBy',
    domain: {},
  },
  {
    name: 'lookupTableProxy',
    domain: { colormaps: ColorMaps },
  },
  {
    name: 'representation',
    domain: {
      items: [
        { text: 'Surface', value: 'Surface' },
        { text: 'Surface with edges', value: 'Surface with edges' },
        { text: 'Wireframe', value: 'Wireframe' },
        { text: 'Points', value: 'Points' },
      ],
    },
  },
  {
    name: 'opacity',
    domain: { min: 0, max: 1, step: 0.01 },
  },
  {
    name: 'interpolateScalarsBeforeMapping',
  },
  {
    name: 'visibility',
  },
  {
    name: 'pointSize',
    domain: { min: 1, max: 50 },
  },
];

const Slice = [
  {
    name: 'visibility',
  },
  {
    name: 'colorWindow',
    domain: { min: 0, max: 255, step: 1 },
  },
  {
    name: 'colorLevel',
    domain: { min: 0, max: 255, step: 1 },
  },
  {
    name: 'slice',
    domain: { min: 0, max: 255, step: 1 },
  },
];

const Molecule = [
  {
    name: 'tolerance',
    domain: { min: 0, max: 0.5, step: 0.01 },
  },
  {
    name: 'atomicRadiusScaleFactor',
    domain: { min: 0, max: 0.5, step: 0.01 },
  },
  {
    name: 'bondRadius',
    domain: { min: 0, max: 0.5, step: 0.01 },
  },
  {
    name: 'deltaBondFactor',
    domain: { min: 0, max: 0.5, step: 0.01 },
  },
  {
    name: 'hideElements',
  },
];

const Glyph = [
  {
    name: 'edgeVisibility',
  },
];

const View3D = [
  {
    name: 'background',
    domain: {
      palette: [],
    },
  },
  {
    name: 'orientationAxesVisibility',
  },
  {
    name: 'presetToOrientationAxes',
    domain: {
      items: [{ text: 'XYZ', value: 'default' }, { text: 'LPS', value: 'lps' }],
    },
  },
];

const View2D = [
  {
    name: 'background',
    domain: {
      palette: [],
    },
  },
  {
    name: 'orientationAxesVisibility',
  },
  {
    name: 'presetToOrientationAxes',
    domain: {
      items: [{ text: 'XYZ', value: 'default' }, { text: 'LPS', value: 'lps' }],
    },
  },
  {
    name: 'annotationOpacity',
    domain: { min: 0, max: 1, step: 0.01 },
  },
];

const Skybox = [{ name: 'position' }];

export default {
  Volume,
  Geometry,
  Slice,
  Molecule,
  Glyph,
  View3D,
  View2D,
  Skybox,
};
