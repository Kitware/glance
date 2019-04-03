// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default {
  name: 'PopUp',
  data() {
    return {
      visible: false,
    };
  },
  mounted() {
    document.addEventListener('mousedown', this.handleMouse, true);
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.handleMouse, true);
  },
  methods: {
    handleMouse(ev) {
      if (this.visible) {
        let parent = ev.target;
        while (parent && parent !== this.$refs.container) {
          parent = parent.parentElement;
        }
        if (parent === null) {
          this.visible = false;
        }
      }
    },
  },
};
