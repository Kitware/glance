import macro from 'vtk.js/Sources/macro';

const { formatNumbersWithThousandSeparator } = macro;

export default {
  name: 'PolyDataInformation',
  props: ['dataset'],
  methods: {
    formatNumbersWithThousandSeparator,
  },
};
