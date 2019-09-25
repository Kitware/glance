export default {
  name: 'ColorGroup',
  props: {
    index: {
      type: Number,
      default: 0,
    },
    top: {
      type: Number,
      default: 0,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    colors: {
      this: Array,
      default: () => ['#e1002a', '#417dc0', '#1d9a57', '#e9bc2f', '#9b3880'],
    },
  },
  computed: {
    style() {
      if (this.visible) {
        return {
          background: this.colors[this.index % this.colors.length],
          top: `${this.top}px`,
        };
      }
      return 'display: none;';
    },
  },
};
