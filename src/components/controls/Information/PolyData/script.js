import macro from 'vtk.js/Sources/macro';

const { formatNumbersWithThousandSeparator } = macro;

export default {
  name: 'PolyData',
  props: ['dataset'],
  methods: {
    formatNumbersWithThousandSeparator,
  },
};
