// ----------------------------------------------------------------------------
// Component methods
// ----------------------------------------------------------------------------

function onItemClick() {
  if (this.item[this.childrenKey]) {
    this.value = !this.value;
  } else {
    this.$emit('input', this.item);
  }
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default {
  name: 'Node',
  props: {
    item: {},
    open: {
      type: Boolean,
      default: false,
    },
    labelKey: {
      type: String,
      default: () => 'name',
    },
    childrenKey: {
      type: String,
      default: () => 'children',
    },
  },
  data() {
    return {
      value: false, // open state
    };
  },
  methods: {
    onItemClick,
  },
};
