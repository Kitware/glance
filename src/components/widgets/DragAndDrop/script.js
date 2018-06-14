// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function onDragOver(ev) {
  const types = ev.dataTransfer.types;
  if (
    types && types instanceof Array
      ? types.indexOf('Files') !== -1
      : 'Files' in types
  ) {
    this.dragHover = true;
    if (this.dragTimeout !== null) {
      window.clearTimeout(this.dragTimeout);
      this.dragTimeout = null;
    }
  }
}

// ----------------------------------------------------------------------------

function onDragLeave() {
  this.dragTimeout = window.setTimeout(() => {
    this.dragHover = false;
    this.dragTimeout = null;
  }, 50);
}

// ----------------------------------------------------------------------------

function onDrop(ev) {
  this.$emit('drop', Array.from(ev.dataTransfer.files));
}

// ----------------------------------------------------------------------------

export default {
  name: 'DragAndDrop',
  data() {
    return {
      dragHover: false,
    };
  },
  methods: {
    onDragOver,
    onDragLeave,
    onDrop,
  },
  created() {
    // used to debounce dragover
    this.dragTimeout = null;
  },
};
