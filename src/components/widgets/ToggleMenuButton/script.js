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
      return this.visible ? 'keyboard_arrow_left' : 'keyboard_arrow_right';
    },
  },
};
