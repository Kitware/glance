<template>
  <div class="layout-grid">
    <div
      class="view-container"
      style="grid-area: 1 / 1 / 2 / 2"
    >
      <VTKViewer type="3D" />
    </div>
  </div>
</template>

<script>
import VTKViewer from 'paraview-glance/components/VTKViewer';

const ViewLayout = {
  components: {
    VTKViewer,
  },
};

export default ViewLayout;
</script>

<style scoped>
.layout-grid {
  display: grid;
  height: 100%;
}

.view-container {
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-flow: column;
}
</style>
