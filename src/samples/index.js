import Images from 'paraview-glance/src/samples/images';

// prettier-ignore
const SampleData = [
  {
    name: 'Lysozyme.pdb',
    image: Images.Lysozyme,
    url: 'https://kitware.github.io/vtk-js-datasets/data/pdb/2LYZ.pdb',
  },
  {
    name: 'MRHead.nrrd',
    image: Images.MRHead,
    url: 'https://kitware.github.io/vtk-js-datasets/data/nrrd/MR-head.nrrd',
  },
  {
    name: 'Tooth.nrrd',
    image: Images.Tooth,
    url: 'https://kitware.github.io/vtk-js-datasets/data/nrrd/tooth.nrrd',
  },
  {
    name: 'Backpack.vti',
    image: Images.Backpack,
    url: 'https://kitware.github.io/vtk-js-datasets/data/vti/backpack.vti',
  },
  {
    name: 'SinglePin.vtp',
    image: Images.SinglePin,
    url: 'https://kitware.github.io/vtk-js-datasets/data/vtp/single-pin.vtp',
  },
];

export default SampleData;
