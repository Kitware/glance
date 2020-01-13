// ----------------------------------------------------------------------------

function sourceToItem(s) {
  return {
    name: s.getName(),
    proxyId: s.getProxyId(),
  };
}

// ----------------------------------------------------------------------------

export default {
  name: 'SourceSelect',
  props: {
    filterFunc: {
      type: Function,
      default: () => () => true,
    },
    label: {
      type: String,
      default: () => '',
    },
    bindToActiveSource: {
      type: Boolean,
      default: () => false,
    },
    hideIfOneDataset: {
      type: Boolean,
      default: () => false,
    },
    value: {
      type: Number,
      default: () => -1,
    },
  },
  data() {
    return {
      sourceList: [],
      internalValue: -1,
    };
  },
  computed: {
    selection() {
      const source = this.$proxyManager.getProxyById(this.internalValue);
      if (source && source.getProxyGroup() === 'Sources') {
        return sourceToItem(source);
      }
      return null;
    },
    shouldHide() {
      return this.hideIfOneDataset && this.sourceList.length <= 1;
    },
  },
  watch: {
    value(value) {
      this.internalValue = value;
    },
  },
  mounted() {
    const source = this.$proxyManager.getActiveSource();
    if (source) {
      this.internalValue = source.getProxyId();
      this.$nextTick(() => this.$emit('input', this.internalValue));
    }
    this.updateSourceList();
  },
  proxyManagerHooks: {
    onProxyModified() {
      this.updateSourceList();
    },
    onActiveSourceChange(source) {
      // HACK: when active source changes, the dataset might not yet be registered
      // to the source, so this setTimeout gets around that issue.
      setTimeout(() => {
        if (this.bindToActiveSource) {
          if (!source || !this.filterFunc(source)) {
            this.internalValue = -1;
          } else if (source.getProxyId() !== this.internalValue) {
            this.internalValue = source.getProxyId();
          }
          this.$emit('input', this.internalValue);
        }
      }, 0);
    },
    onProxyRegistrationChange(info) {
      const { proxyGroup } = info;
      if (proxyGroup === 'Sources') {
        this.updateSourceList();
      }
    },
  },
  methods: {
    updateSourceList() {
      const sources = this.$proxyManager
        .getSources()
        .filter(
          (s) =>
            Boolean(s.getDataset()) &&
            s.getProxyName() === 'TrivialProducer' &&
            this.filterFunc(s)
        );
      this.sourceList = sources.map((s) => sourceToItem(s));
    },
    makeSelection(sourceId) {
      if (sourceId !== this.internalValue) {
        if (this.bindToActiveSource) {
          const s = this.$proxyManager.getProxyById(sourceId);
          if (s) {
            this.$proxyManager.setActiveSource(s);
          }
        }
        this.$emit('input', sourceId);
      }
    },
  },
};
