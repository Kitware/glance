// ----------------------------------------------------------------------------
// Component methods
// ----------------------------------------------------------------------------

function onMouseDown(ev) {
  if (!this.$el.contains(ev.target)) {
    this.$emit('input', false);
  }
}

// ----------------------------------------------------------------------------

function updateHeight() {
  this.sheetTop = -this.$refs.slotWrapper.offsetHeight;
}

// ----------------------------------------------------------------------------

function updateVisibility(newVal, oldVal) {
  if (newVal && !oldVal) {
    document.addEventListener('mousedown', this.onMouseDown, true);
    this.$nextTick(() => {
      this.updateHeight();
      this.visible = true;
    });
  } else {
    document.removeEventListener('mousedown', this.onMouseDown, true);
    this.visible = false;
  }
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default {
  props: {
    value: { type: Boolean, default: false },
  },
  data: () => ({
    sheetTop: 0,
    visible: false,
  }),
  methods: {
    onMouseDown,
    updateHeight,
  },
  watch: {
    value: updateVisibility,
  },
  mounted() {
    // maybe debounce this?
    window.addEventListener('resize', this.updateHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateHeight);
  },
};
