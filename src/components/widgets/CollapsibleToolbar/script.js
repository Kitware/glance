export default {
  name: 'CollapsibleToolbar',
  props: {
    collapse: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default() {
        return this.$vuetify.breakpoint.smAndDown;
      },
    },
  },
  computed: {
    state() {
      if (this.collapse) {
        return 'collapse';
      }
      return this.dense ? 'dense' : 'expand';
    },
  },
};
