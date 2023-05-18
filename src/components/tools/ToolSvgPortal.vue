<template>
  <div>
    <portal v-for="dest in portalDestinations" :key="dest" :to="dest">
      <template #default="{ viewProxyId }">
        <slot :view-proxy-id="viewProxyId" />
      </template>
    </portal>
  </div>
</template>

<script>
import { Portal } from 'portal-vue';

export default {
  name: 'ToolSvgPortal',
  components: { Portal },
  data() {
    return {
      portalDestinations: [],
    };
  },
  mounted() {
    this.$toolSvgPortal.addEventListener('updateTargets', this.updateTargets);
    this.updateTargets();
  },
  beforeDestroy() {
    this.$toolSvgPortal.removeEventListener(
      'updateTargets',
      this.updateTargets
    );
  },
  methods: {
    updateTargets() {
      this.portalDestinations = [...this.$toolSvgPortal.targets];
    },
  },
};
</script>
