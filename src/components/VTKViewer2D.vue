<template>
  <div class="vtk-container" />
</template>

<script>
let subscriptions = [];

function onMounted() {
  const container = this.$el;

  this.view = this.proxyManager.createProxy('Views', 'View2D');
  this.view.setContainer(container);
  this.view.resetCamera();
  this.view.resize();

  window.addEventListener('resize', this.view.resize);

  subscriptions = [
    {
      unsubscribe: () => window.removeEventListener('resize', this.view.resize),
    },
  ];
}

function onBeforeDestroy() {
  while (subscriptions.length) {
    subscriptions.pop().unsubscribe();
  }
}

const VTKViewer2D = {
  inject: ['proxyManager'],
  data: () => ({
    view: null,
  }),
  mounted() {
    this.$nextTick(onMounted);
  },
  beforeDestroy: onBeforeDestroy,
};

export default VTKViewer2D;
</script>

<style scoped>
.vtk-container {
  position: relative;
  height: 100%;
}
</style>
