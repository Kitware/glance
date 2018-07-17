import helper from 'paraview-glance/src/components/core/Datasets/helper';

const FIELDS = [
  { name: 'pointSize', initialValue: 1 },
  { name: 'opacity', initialValue: 1 },
  { name: 'sampleDistance', initialValue: 1 },
  { name: 'edgeGradient', initialValue: 1 },
  { name: 'representation', initialValue: 'Surface' },
];

export default helper.generateComponent('Representation', FIELDS);
