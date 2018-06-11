import helper from 'paraview-glance/src/components/core/Datasets/helper';

const FIELDS = [
  { name: 'visibility', initialValue: false },
  { name: 'colorLevel', initialValue: 1024 },
  { name: 'colorWindow', initialValue: 2048 },
  { name: 'xSlice', initialValue: -1 },
  { name: 'ySlice', initialValue: -1 },
  { name: 'zSlice', initialValue: -1 },
  { name: 'sliceVisibility', initialValue: false },

];

export default helper.generateComponent(FIELDS);
