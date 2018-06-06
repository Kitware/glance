<template>
  <div :class="$style.layoutGrid">
    <div
      :class="$style.viewContainer"
      style="grid-area: 1 / 1 / 2 / 2"
    >
      <VTKViewer type="3D" />
    </div>
  </div>
</template>

<style module src="./ViewLayout.css">
</style>
<script src="./ViewLayout.js">
</script>
