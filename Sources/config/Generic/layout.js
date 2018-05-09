import Layout2D from '../../layouts/Layout2D';
import Layout3D from '../../layouts/Layout3D';

export default {
  layouts: {
    '2D': {
      grid: [1, 1],
      views: {
        // stacked
        sliceX: { cell: [1, 1] },
        sliceY: { cell: [1, 1], defaultVisible: true, defaultActive: true },
        sliceZ: { cell: [1, 1] },
      },
    },
    '3D': {
      grid: [1, 1],
      views: {
        volume: { cell: [1, 1], defaultActive: true },
      },
    },
    Split: {
      grid: [1, 2],
      views: {
        // stacked
        sliceX: { cell: [1, 1] },
        sliceY: { cell: [1, 1], defaultVisible: true },
        sliceZ: { cell: [1, 1] },

        volume: { cell: [1, 2], defaultActive: true },
      },
    },
    Quad: {
      grid: [2, 2],
      views: {
        sliceX: {
          cell: [2, 1],
          propOverrides: {
            title: '-Z+Y',
            orientations: [],
          },
        },
        sliceY: {
          cell: [1, 1],
          propOverrides: {
            title: '-Z+X',
            orientations: [],
          },
        },
        sliceZ: {
          cell: [2, 2],
          propOverrides: {
            title: '+X+Y',
            orientations: [],
          },
        },
        volume: { cell: [1, 2], defaultActive: true },
      },
    },
  },
  views: {
    sliceX: {
      component: Layout2D,
      props: {
        viewType: 'View2D_X',
        axis: 0,
        orientation: 1,
        viewUp: [0, 0, 1],
        onAxisChange: (axis) => ['sliceX', 'sliceY', 'sliceZ'][axis],
      },
      stackChangeFunc: 'onAxisChange',
    },
    sliceY: {
      component: Layout2D,
      props: {
        viewType: 'View2D_Y',
        axis: 1,
        orientation: -1,
        viewUp: [0, 0, 1],
        onAxisChange: (axis) => ['sliceX', 'sliceY', 'sliceZ'][axis],
      },
      stackChangeFunc: 'onAxisChange',
    },
    sliceZ: {
      component: Layout2D,
      props: {
        viewType: 'View2D_Z',
        axis: 2,
        orientation: 1,
        viewUp: [0, 1, 0],
        onAxisChange: (axis) => ['sliceX', 'sliceY', 'sliceZ'][axis],
      },
      stackChangeFunc: 'onAxisChange',
    },
    volume: {
      component: Layout3D,
      props: {
        axis: 1,
        orientation: -1,
        viewUp: [0, 0, 1],
      },
    },
  },
};
