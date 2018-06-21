import Images from 'paraview-glance/src/samples/images';

// prettier-ignore
export default [
  {
    label: 'Lysozyme.pdb',
    image: Images.Lysozyme,
    size: '135 KB',
    datasets: [
      {
        name: 'Lysozyme.pdb',
        url: 'https://kitware.github.io/vtk-js-datasets/data/pdb/2LYZ.pdb',
      },
    ],
  },
  {
    label: 'LIDC2.vti',
    image: Images.LIDC2,
    size: '2 MB',
    datasets: [
      {
        name: 'LIDC2.vti',
        url: 'https://kitware.github.io/vtk-js-datasets/data/vti/LIDC2.vti',
      },
    ],
  },
  {
    label: 'Tooth.nrrd',
    image: Images.Tooth,
    size: '1.6 MB',
    datasets: [
      {
        name: 'Tooth.nrrd',
        url: 'https://kitware.github.io/vtk-js-datasets/data/nrrd/tooth.nrrd',
      },
    ],
  },
  {
    label: 'Backpack.vti',
    image: Images.Backpack,
    size: '8.3 MB',
    datasets: [
      {
        name: 'Backpack.vti',
        url: 'https://kitware.github.io/vtk-js-datasets/data/vti/backpack.vti',
      },
    ],
  },
  {
    label: 'SinglePin.vtp',
    image: Images.SinglePin,
    size: '8.2 MB',
    datasets: [
      {
        name: 'SinglePin.vtp',
        url: 'https://kitware.github.io/vtk-js-datasets/data/vtp/single-pin.vtp',
      },
    ],
  },
  {
    label: 'lidar.vtp',
    image: Images.Lidar,
    size: '5.3 MB',
    datasets: [
      {
        name: 'lidar.vtp',
        url: 'https://kitware.github.io/vtk-js-datasets/data/vtp/lidar.vtp',
      },
    ],
  },
];
