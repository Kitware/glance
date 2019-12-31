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
    document.addEventListener('keydown', this.handleEsc);
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.handleMouse, true);
    document.removeEventListener('keydown', this.handleEsc);
  },
  methods: {
    handleMouse(ev) {
      if (this.visible) {
        let parent = ev.target;
        while (
          parent &&
          parent !== this.$refs.container &&
          parent !== this.$refs.popup
        ) {
          parent = parent.parentElement;
        }
        if (parent === null) {
          this.visible = false;
        }
      }
    },
    handleEsc(ev) {
      if (this.visible && ev.keyCode === 27) {
        // Esc
        this.close();
      }
    },
    getPositioning() {
      const anchor = this.$refs.anchor;
      const { top: y, left: x } = anchor.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (y > viewportHeight / 2) {
        return {
          bottom: `${viewportHeight - y}px`,
          left: `${x}px`,
        };
      }
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
