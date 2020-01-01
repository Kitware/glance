export default {
  name: 'CollapsibleToolbarItem',
  props: {
    state: {
      type: String,
      default: 'expand', // expand | dense | collapse
    },
  },
};
