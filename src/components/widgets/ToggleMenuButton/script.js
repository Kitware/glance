export default {
  name: 'ToggleMenuButton',
  props: {
    disable: {
      type: Boolean,
      default: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    icon() {
      return this.visible ? 'mdi-chevron-left' : 'mdi-chevron-right';
    },
  },
};
