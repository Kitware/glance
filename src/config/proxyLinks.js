const Volume = [
  // { link: 'ColorBy', property: 'colorBy' },
  // { link: 'VolumeVisibility', property: 'volumeVisibility' },
  // { link: 'UseShadow', property: 'useShadow' },
  // { link: 'SampleDistance', property: 'sampleDistance' },
  // { link: 'EdgeGradient', property: 'edgeGradient' },
  { link: 'ColorWindow', property: 'colorWindow' },
  { link: 'ColorLevel', property: 'colorLevel' },
  // { link: 'SliceVisibility', property: 'sliceVisibility' },
  { link: 'SliceX', property: 'xSlice' },
  { link: 'SliceY', property: 'ySlice' },
  { link: 'SliceZ', property: 'zSlice' },
];

const Geometry = [
  { link: 'GeometryColorBy', property: 'colorBy' },
  { link: 'Representation', property: 'representation' },
  { link: 'Opacity', property: 'opacity' },
  {
    link: 'InterpolateScalarsBeforeMapping',
    property: 'interpolateScalarsBeforeMapping',
  },
  { link: 'GeometryVisibility', property: 'visibility' },
  { link: 'PointSize', property: 'pointSize' },
];

const Slice = [
  // { link: 'SliceVisibility', property: 'visibility' },
  { link: 'ColorWindow', property: 'colorWindow' },
  { link: 'ColorLevel', property: 'colorLevel' },
];

const Molecule = [
  { link: 'Tolerance', property: 'tolerance' },
  { link: 'AtomicRadiusScaleFactor', property: 'atomicRadiusScaleFactor' },
  { link: 'BondRadius', property: 'bondRadius' },
  { link: 'DeltaBondFactor', property: 'deltaBondFactor' },
  { link: 'HideElements', property: 'hideElements' },
];

const Glyph = [{ link: 'GlyphEdgeVisibility', property: 'edgeVisibility' }];

const Skybox = [{ link: 'SkyboxPosition', property: 'position' }];

export default {
  Volume,
  Geometry,
  Slice,
  Molecule,
  Glyph,
  Skybox,
};
