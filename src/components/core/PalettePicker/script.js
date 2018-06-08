// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default {
  name: 'PalettePicker',
  props: {
    palette: {
      type: Array,
      default: () => [],
    },
    size: {
      type: Number,
      default: 24,
    },
    value: {
      type: String,
      default: '',
    },
  },
  methods: {
    getStyles(color) {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
        background: color,
      };
    },
  },
};
