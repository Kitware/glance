export function createPaletteCycler(palette) {
  let i = 0;
  return {
    reset: () => {
      i = 0;
    },
    next: () => {
      const color = palette[i];
      i = (i + 1) % palette.length;
      return color;
    },
  };
}

export const SPECTRAL = [
  '#9e0142',
  '#d53e4f',
  '#f46d43',
  '#fdae61',
  '#fee08b',
  '#ffffbf',
  '#e6f598',
  '#abdda4',
  '#66c2a5',
  '#3288bd',
  '#5e4fa2',
];

export const WIDGETS = [
  '#ffee00',
  '#bbbe64',
  '#f3b700',
  '#91f5ad',
  '#fdca40',
  '#f79824',
  '#e57c04',
];

export default {
  createPaletteCycler,
  SPECTRAL,
  WIDGETS,
};
