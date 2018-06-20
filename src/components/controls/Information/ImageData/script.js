import MatrixView from 'paraview-glance/src/components/controls/Information/MatrixView';

export default {
  name: 'ImageData',
  props: ['dataset'],
  components: {
    MatrixView,
  },
  methods: {
    showVect: (vect, d = ', ') => vect.join(`${d}`),
  },
};
