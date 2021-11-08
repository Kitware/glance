import macro from '@kitware/vtk.js/macro';

const { formatNumbersWithThousandSeparator } = macro;

export default {
  name: 'PolyDataInformation',
  props: ['dataset'],
  methods: {
    formatNumbersWithThousandSeparator,
  },
};
