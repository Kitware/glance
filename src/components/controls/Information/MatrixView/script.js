export default {
  name: 'MatrixView',
  props: {
    rows: { type: Number, required: true },
    columns: { type: Number, required: true },
    matrix: { required: true },
  },
};
