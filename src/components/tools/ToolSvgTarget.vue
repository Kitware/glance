<template>
  <portal-target
    :name="portalName"
    multiple
    tag="svg"
    :slot-props="{ viewProxyId }"
  />
</template>

<script>
import { PortalTarget } from 'portal-vue';

export default {
  name: 'ToolsSvg',
  components: {
    PortalTarget,
  },
  props: {
    viewProxyId: {
      type: String,
      required: true,
    },
  },
  computed: {
    portalName() {
      return `PortalTarget__${this.viewProxyId}`;
    },
  },
  mounted() {
    this.$toolSvgPortal.addTarget(this.portalName);
  },
  beforeDestroy() {
    this.$toolSvgPortal.removeTarget(this.portalName);
  },
};
</script>
