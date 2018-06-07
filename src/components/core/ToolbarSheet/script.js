// ----------------------------------------------------------------------------
// Component methods
// ----------------------------------------------------------------------------

function onMouseDown(ev) {
  if (!this.$el.contains(ev.target)) {
    this.$emit('input', false);
  }
}

// ----------------------------------------------------------------------------

function updateVisibility(newVal, oldVal) {
  if (newVal && !oldVal) {
    document.addEventListener('mousedown', this.onMouseDown, true);
    this.$nextTick(() => {
      this.visiblityOffset = -this.$el.offsetHeight;
    });
  } else {
    document.removeEventListener('mousedown', this.onMouseDown, true);
    this.visiblityOffset = 0;
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
    visiblityOffset: 0,
  }),
  methods: {
    onMouseDown,
  },
  watch: {
    value: updateVisibility,
  },
};
