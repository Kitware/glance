import MatrixView from 'paraview-glance/src/components/controls/Information/MatrixView';

export default {
  name: 'ImageDataInformation',
  props: ['dataset'],
  components: {
    MatrixView,
  },
  methods: {
    showVect: (vect, d = ', ') => vect.join(`${d}`),
  },
};
