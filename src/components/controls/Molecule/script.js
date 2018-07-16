import helper from 'paraview-glance/src/components/core/Datasets/helper';

const FIELDS = [
  { name: 'tolerance', initialValue: 1 },
  { name: 'atomicRadiusScaleFactor', initialValue: 1 },
  { name: 'bondRadius', initialValue: 1 },
  // { name: 'deltaBondFactor', initialValue: 1 },
  { name: 'hideElements', initialValue: '' },
];

export default helper.generateComponent('Molecule', FIELDS, false, {
  onChange: {
    bondRadius: 'updateData',
    atomicRadiusScaleFactor: 'updateData',
    // tolerance: 'updateData',
  },
});
