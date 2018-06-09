export const FIELDS = [
  { name: 'pointSize', initialValue: 1 },
  { name: 'opacity', initialValue: 1 },
  { name: 'sampleDistance', initialValue: 1 },
  { name: 'edgeGradient', initialValue: 1 },
  { name: 'representation', initialValue: 'Surface' },
];

export const FIELD_NAMES = FIELDS.map((f) => f.name);

export default {
  FIELDS,
  FIELD_NAMES,
};
