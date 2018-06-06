<template>
  <v-app>
    <v-navigation-drawer
      :value="sidebar"
      absolute
      app
      clipped
      hide-overlay
      stateless
    >
      <v-tabs
        v-model="activeTab"
        color="grey lighten-4"
        slider-color="green"
      >
        <v-tab>Datasets</v-tab>
        <v-tab>Tools</v-tab>
        <v-tab>Settings</v-tab>
        <v-tab-item>Datasets</v-tab-item>
        <v-tab-item>Tools...</v-tab-item>
        <v-tab-item>settings...</v-tab-item>
      </v-tabs>
    </v-navigation-drawer>
    <v-toolbar
      clipped-left
      app
    >
      <v-toolbar-side-icon @click.native.stop="sidebar = !sidebar" />
      <v-toolbar-title>ParaView Glance</v-toolbar-title>
      <v-spacer />
      <v-btn
        flat
        class="toolbar-button"
      >
        <v-icon>folder</v-icon>
        <span>Open</span>
      </v-btn>
      <v-btn
        flat
        class="toolbar-button"
      >
        <v-icon>collections</v-icon>
        <span>Screenshots (0)</span>
      </v-btn>
      <v-btn
        flat
        class="toolbar-button"
      >
        <v-icon>help</v-icon>
        <span>About</span>
      </v-btn>
    </v-toolbar>
  </v-app>
</template>

<style scoped>
.toolbar-button span {
  margin-left: 4px;
}
</style>

<script>
const data = () => ({
  sidebar: true,
  activeTab: 0,
});

export default {
  data,
};
</script>
