import Images from 'paraview-glance/src/samples/images';

// prettier-ignore
export default [
  {
    label: '202-t + Edges',
    image: Images.CAD,
    url: 'https://kitware.github.io/vtk-js-datasets/data/vtp/202-t.vtp',
    size: '112 KB',
    description: 'T-Handle, Flanged Base, Solid Bar',
    acknowledgement: 'https://www.traceparts.com/',
    datasets: [
      {
        name: '202-t.vtp',
        url: 'https://kitware.github.io/vtk-js-datasets/data/vtp/202-t.vtp',
      },
      {
        name: '202-t-edges.vtp',
        url: 'https://kitware.github.io/vtk-js-datasets/data/vtp/202-t-edges.vtp',
      },
    ],
  },
  {
    label: 'Lysozyme.pdb',
    image: Images.Lysozyme,
    size: '135 KB',
    description: 'an enzyme that catalyzes the destruction of the cell walls of certain bacteria, occurring notably in tears and egg white.',
    datasets: [
      {
        name: 'Lysozyme.pdb',
        url: 'https://kitware.github.io/vtk-js-datasets/data/pdb/2LYZ.pdb',
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
    label: 'Engine',
    image: Images.Engine,
    size: '3.1 MB',
    datasets: [
      {
        name: 'Engine.vti',
        url: 'https://kitware.github.io/vtk-js-datasets/data/vti/engine.vti',
      },
    ],
    acknowledgement: 'General Electric',
    description: 'CT scan of two cylinders of an engine block.',
  },
  {
    label: 'lidar.vtp',
    image: Images.Lidar,
    size: '5.3 MB',
    description: 'Aerial LIDAR data',
    datasets: [
      {
        name: 'lidar.vtp',
        url: 'https://kitware.github.io/vtk-js-datasets/data/vtp/lidar.vtp',
      },
    ],
  },
  {
    label: 'SinglePin.vtp',
    image: Images.SinglePin,
    size: '8.2 MB',
    description: 'Mixing Vane inside reactor pin for cooling',
    acknowledgement: "Simulation data from Hydra-TH",
    datasets: [
      {
        name: 'SinglePin.vtp',
        url: 'https://kitware.github.io/vtk-js-datasets/data/vtp/single-pin.vtp',
      },
    ],
  },
  {
    label: 'Skull.nrrd',
    image: Images.Skull,
    size: '10.1 MB',
    datasets: [
      {
        name: 'skull.nrrd',
        url: 'https://kitware.github.io/vtk-js-datasets/data/nrrd/skull.nrrd',
      },
    ],
    acknowledgement: 'Siemens Medical Solutions, Forchheim, Germany',
    description: 'Rotational C-arm x-ray scan of phantom of a human skull.',
  },
  {
    label: 'LIDC2.mha',
    image: Images.LIDC2,
    size: '1.5 MB',
    datasets: [
      {
        name: 'LIDC2.mha',
        url: 'https://kitware.github.io/vtk-js-datasets/data/mha/LIDC2.mha',
      },
    ],
  },
  {
    label: 'Aneurism.vti',
    image: Images.Aneurism,
    size: '348 KB',
    datasets: [
      {
        name: 'Aneurism.vti',
        url: 'https://kitware.github.io/vtk-js-datasets/data/vti/aneurism.vti',
      },
    ],
    acknowledgement: 'Philips Research, Hamburg, Germany',
    description: 'Rotational C-arm x-ray scan of the arteries of the right half of a human head. A contrast agent was injected into the blood and an aneurism is present.',
  },
  // {
  //   label: 'Backpack.vti',
  //   image: Images.Backpack,
  //   size: '8.3 MB',
  //   description: "CT scan of a backpack filled with items.",
  //   acknowledgement: "Kevin Kreeger, Viatronix Inc., USA",
  //   datasets: [
  //     {
  //       name: 'Backpack.vti',
  //       url: 'https://kitware.github.io/vtk-js-datasets/data/vti/backpack.vti',
  //     },
  //   ],
  // },
  // {
  //   label: 'Head MRI CISS',
  //   image: Images.Head,
  //   size: '5.1 MB',
  //   datasets: [
  //     {
  //       name: 'Head.vti',
  //       url: 'https://kitware.github.io/vtk-js-datasets/data/vti/mri_ventricles.vti',
  //     },
  //   ],
  //   acknowledgement: 'Dirk Bartz, VCM, University of Tübingen, Germany',
  //   description: '1.5T MRT 3D CISS dataset of a human head that highlights the CSF (Cerebro-Spinal-Fluid) filled cavities of the head.',
  // },
  // {
  //   label: 'Foot',
  //   image: Images.Foot,
  //   url: 'https://kitware.github.io/vtk-js-datasets/data/vti/foot.vti',
  //   size: '4.3 MB',
  //   datasets: [
  //     {
  //       name: 'Foot.vti',
  //       url: 'https://kitware.github.io/vtk-js-datasets/data/vti/foot.vti',
  //     },
  //   ],
  //   acknowledgement: 'Philips Research, Hamburg, Germany',
  //   description: 'Rotational C-arm x-ray scan of a human foot. Tissue and bone are present in the dataset.',
  // },
];
