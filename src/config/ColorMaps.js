import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';
import Presets from 'paraview-glance/src/config/Presets.json';

const DEFAULT_PRESET = {
  ...vtkColorMaps.getPresetByName('Cool to Warm'),
  Name: 'Default (Cool to Warm)',
};

// sorts case insensitively
function comparator(a, b) {
  const s1 = a.Name.toLowerCase();
  const s2 = b.Name.toLowerCase();
  return s1 > s2 ? 1 : -(s1 < s2);
}

// register medical colormaps
function registerPresets(presets) {
  presets.forEach((preset) => {
    if (preset.Children) {
      registerPresets(preset.Children);
    } else {
      vtkColorMaps.addPreset(preset);
    }
  });
}

function createGroup(name, childrenNames) {
  const children = childrenNames.map((n) => vtkColorMaps.getPresetByName(n));
  children.sort(comparator);
  return {
    Name: name,
    Children: children,
  };
}

// add custom presets
registerPresets(Presets.concat(DEFAULT_PRESET));

export default [].concat(
  DEFAULT_PRESET,
  Presets,
  createGroup('ParaView', [
    '2hot',
    'Asymmtrical Earth Tones (6_21b)',
    'Cold and Hot',
    'Cool to Warm (Extended)',
    'Cool to Warm',
    'coolwarm',
    'Grayscale',
    'Linear Blue (8_31f)',
    'Linear YGB 1211g',
    'Rainbow Blended Black',
    'Rainbow Blended Grey',
    'Rainbow Blended White',
    'Rainbow Desaturated',
    'rainbow',
    'Warm to Cool (Extended)',
    'Warm to Cool',
  ]),
  createGroup('ERDC', [
    'erdc_blue2cyan_BW',
    'erdc_blue2gold',
    'erdc_blue2gold_BW',
    'erdc_blue2green_BW',
    'erdc_blue2green_muted',
    'erdc_blue2yellow',
    'erdc_blue_BW',
    'erdc_brown_BW',
    'erdc_cyan2orange',
    'erdc_divHi_purpleGreen',
    'erdc_divHi_purpleGreen_dim',
    'erdc_divLow_icePeach',
    'erdc_divLow_purpleGreen',
    'erdc_gold_BW',
    'erdc_green2yellow_BW',
    'erdc_iceFire_H',
    'erdc_iceFire_L',
    'erdc_magenta_BW',
    'erdc_marine2gold_BW',
    'erdc_orange_BW',
    'erdc_pbj_lin',
    'erdc_purple2green',
    'erdc_purple2green_dark',
    'erdc_purple2pink_BW',
    'erdc_purple_BW',
    'erdc_rainbow_bright',
    'erdc_rainbow_dark',
    'erdc_red2purple_BW',
    'erdc_red2yellow_BW',
    'erdc_red_BW',
    'erdc_sapphire2gold_BW',
  ]),
  createGroup('Others', [
    'Black, Blue and White',
    'Black, Orange and White',
    'Black-Body Radiation',
    'blot',
    'Blue to Red Rainbow',
    'Blue to Yellow',
    'BLUE-WHITE',
    'blue2cyan',
    'blue2yellow',
    'Blues',
    'bone_Matlab',
    'BrBG',
    'BrOrYl',
    'BuGn',
    'BuGnYl',
    'BuPu',
    'BuRd',
    'CIELab Blue to Red',
    'CIELab_blue2red',
    'copper_Matlab',
    'GBBr',
    'gist_earth',
    'GnBu',
    'GnBuPu',
    'GnRP',
    'GnYlRd',
    'gray_Matlab',
    'Green-Blue Asymmetric Divergent (62Blbc)',
    'GREEN-WHITE_LINEAR',
    'Greens',
    'GYPi',
    'GyRd',
    'Haze',
    'Haze_cyan',
    'Haze_green',
    'Haze_lime',
    'heated_object',
    'hsv',
    'hue_L60',
    'Inferno (matplotlib)',
    'jet',
    'magenta',
    'Magma (matplotlib)',
    'Muted Blue-Green',
    'nic_CubicL',
    'nic_CubicYF',
    'nic_Edge',
    'Oranges',
    'OrPu',
    'pink_Matlab',
    'PiYG',
    'Plasma (matplotlib)',
    'PRGn',
    'PuBu',
    'PuOr',
    'PuRd',
    'Purples',
    'RdOr',
    'RdOrYl',
    'RdPu',
    'Red to Blue Rainbow',
    'Spectral_lowBlue',
    'Viridis (matplotlib)',
    'X Ray',
    'Yellow 15',
  ])
);
