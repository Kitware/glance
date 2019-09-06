import { Portal } from '@linusborg/vue-simple-portal';

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default {
  name: 'PopUp',
  components: {
    Portal,
  },
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
    getPositioning() {
      const anchor = this.$refs.anchor;
      const { top: y, left: x } = anchor.getBoundingClientRect();
      return {
        top: `${y}px`,
        left: `${x}px`,
      };
    },
    close() {
      this.visible = false;
    },
  },
};
