import Node from 'paraview-glance/src/components/widgets/TreeView/Node';

// ----------------------------------------------------------------------------
// Component methods
// ----------------------------------------------------------------------------

// Default filter function
function indexOfFilterFunc(item, term) {
  return item[this.labelKey].toLowerCase().indexOf(term.toLowerCase()) > -1;
}

// ----------------------------------------------------------------------------

function filter(tree, term, func) {
  const retval = [];
  for (let i = 0; i < tree.length; ++i) {
    if (tree[i][this.childrenKey]) {
      const subtreeFiltered = this.filter(
        tree[i][this.childrenKey],
        term,
        func
      );
      if (subtreeFiltered.length) {
        retval.push({ ...tree[i], [this.childrenKey]: subtreeFiltered });
      }
    } else if (func(tree[i], term)) {
      retval.push(tree[i]);
    }
  }
  return retval;
}

// ----------------------------------------------------------------------------

function onSelect(item) {
  this.$emit('input', item);
}

// ----------------------------------------------------------------------------

function trySelect(tree) {
  if (tree.length === 1) {
    if (tree[0][this.childrenKey]) {
      this.trySelect(tree[0][this.childrenKey]);
    } else {
      this.onSelect(tree[0]);
    }
  }
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default {
  name: 'TreeView',
  components: {
    Node,
  },
  props: {
    tree: {
      type: Array,
      default: () => [],
    },
    filterFunc: Function,
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
      filterText: null,
    };
  },
  computed: {
    filteredTree() {
      if (this.filterText) {
        return this.filter(
          this.tree,
          this.filterText,
          this.filterFunc || this.indexOfFilterFunc
        );
      }
      // no filter
      return this.tree;
    },
  },
  methods: {
    onSelect,
    trySelect,
    filter,
    indexOfFilterFunc,
  },
};
