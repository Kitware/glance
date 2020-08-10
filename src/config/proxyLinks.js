const Volume = [
  // { link: 'ColorBy', property: 'colorBy' },
  { link: 'Visibility', property: 'visibility', updateOnBind: true },
  // { link: 'UseShadow', property: 'useShadow' },
  // { link: 'SampleDistance', property: 'sampleDistance' },
  // { link: 'EdgeGradient', property: 'edgeGradient' },
  { link: 'WW', property: 'windowWidth', updateOnBind: true },
  { link: 'WL', property: 'windowLevel', updateOnBind: true },
  {
    link: 'SliceX',
    property: 'xSlice',
    updateOnBind: true,
    type: 'application',
  },
  {
    link: 'SliceY',
    property: 'ySlice',
    updateOnBind: true,
    type: 'application',
  },
  {
    link: 'SliceZ',
    property: 'zSlice',
    updateOnBind: true,
    type: 'application',
  },
  {
    link: 'SliceOpacity',
    property: 'sliceOpacity',
    updateOnBind: true,
  },
  {
    link: 'UseSliceColor',
    property: 'sliceUseColorByForColor',
    updateOnBind: true,
  },
  {
    link: 'UseSliceOpacity',
    property: 'sliceUseColorByForOpacity',
    updateOnBind: true,
  },
];

const Geometry = [
  { link: 'GeometryColorBy', property: 'colorBy', updateOnBind: true },
  { link: 'Representation', property: 'representation', updateOnBind: true },
  { link: 'Opacity', property: 'opacity', updateOnBind: true },
  {
    link: 'InterpolateScalarsBeforeMapping',
    property: 'interpolateScalarsBeforeMapping',
    updateOnBind: true,
  },
  { link: 'Visibility', property: 'visibility', updateOnBind: true },
  { link: 'PointSize', property: 'pointSize', updateOnBind: true },
];

const Slice = [
  { link: 'Visibility', property: 'visibility', updateOnBind: true },
  { link: 'WW', property: 'windowWidth', updateOnBind: true },
  { link: 'WL', property: 'windowLevel', updateOnBind: true },
  { link: 'SliceOpacity', property: 'opacity', updateOnBind: true },
  {
    link: 'UseSliceColor',
    property: 'useColorByForColor',
    updateOnBind: true,
  },
  {
    link: 'UseSliceOpacity',
    property: 'useColorByForOpacity',
    updateOnBind: true,
  },
];

const Molecule = [
  { link: 'Tolerance', property: 'tolerance', updateOnBind: true },
  {
    link: 'AtomicRadiusScaleFactor',
    property: 'atomicRadiusScaleFactor',
    updateOnBind: true,
  },
  { link: 'BondRadius', property: 'bondRadius', updateOnBind: true },
  { link: 'DeltaBondFactor', property: 'deltaBondFactor', updateOnBind: true },
  { link: 'HideElements', property: 'hideElements', updateOnBind: true },
];

const Glyph = [
  {
    link: 'GlyphEdgeVisibility',
    property: 'edgeVisibility',
    updateOnBind: true,
  },
];

const Skybox = [
  { link: 'SkyboxPosition', property: 'position', updateOnBind: true },
];

export default {
  Volume,
  Geometry,
  Slice,
  Molecule,
  Glyph,
  Skybox,
};
