const NO_SOURCE = -1;

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
      default: () => -1,
    },
    disabled: {
      type: Boolean,
      default: () => false,
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
      this.setInternalValue(source.getProxyId());
    }
    this.updateSourceList();
  },
  proxyManagerHooks: {
    onProxyModified(proxy) {
      if (proxy.getProxyId() === this.waitForActiveDataset) {
        this.waitForActiveDataset = null;
        this.setInternalValue(proxy.getProxyId());
      }
      this.updateSourceList();
    },
    onActiveSourceChange(source) {
      if (this.bindToActiveSource) {
        if (!source) {
          this.setInternalValue(NO_SOURCE);
        } else if (source.getProxyId() !== this.internalValue) {
          const proxyId = source.getProxyId();
          if (source.getDataset()) {
            this.setInternalValue(proxyId);
          } else {
            // defer until proxy gets a dataset
            this.waitForActiveDataset = proxyId;
          }
        }
      }
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
        .filter((s) => s && !!s.getDataset() && this.filterFunc(s));
      this.sourceList = sources.map((s) => sourceToItem(s));
    },
    setInternalValue(v) {
      if (v !== this.internalValue) {
        this.internalValue = v;
        this.$emit('input', v);
      }
    },
  },
};
