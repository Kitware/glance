import { mapState } from 'vuex';

import vtkListenerHelper from 'paraview-glance/src/ListenerHelper';

import ColorByWidget from 'paraview-glance/src/components/controls/ColorBy';
import InformationWidget from 'paraview-glance/src/components/controls/Information';
import MoleculeWidget from 'paraview-glance/src/components/controls/Molecule';
import RepresentationWidget from 'paraview-glance/src/components/controls/Representation';
import SliceWidget from 'paraview-glance/src/components/controls/SliceControl';

import ColorGroup from 'paraview-glance/src/components/widgets/ColorGroup';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function onMounted() {
  this.subscriptions = [
    this.proxyManager.onProxyRegistrationChange(({ proxyGroup }) => {
      if (proxyGroup === 'Sources') {
        this.datasets = this.proxyManager.getSources();
      }
      this.listenerHelper.resetListeners();
    }),
  ];
}

// ----------------------------------------------------------------------------

function onBeforeDestroy() {
  this.listenerHelper.removeListeners();
  while (this.subscriptions.length) {
    this.subscriptions.pop().unsubscribe();
  }
}

// ----------------------------------------------------------------------------

function deleteDataset(proxy) {
  this.proxyToDelete = proxy;
  // work-around for bug where vuetify's menu loses its activator
  // when deleting datasets. Waiting 100ms should be enough time
  // for vuetify's menu to hide before actually deleting the dataset.
  window.setTimeout(() => {
    this.proxyManager.deleteProxy(proxy);
    this.proxyManager.renderAllViews();
    this.proxyToDelete = null;
  }, 100);
}

// ----------------------------------------------------------------------------

function getDatasetVisibility(source) {
  return this.proxyManager
    .getRepresentations()
    .filter((r) => r.getInput() === source)[0]
    .isVisible();
}

// ----------------------------------------------------------------------------

function toggleDatasetVisibility(source) {
  const visible = !this.getDatasetVisibility(source);
  this.proxyManager
    .getRepresentations()
    .filter((r) => r.getInput() === source)
    .forEach((r) => r.setVisibility(visible));
  this.$forceUpdate();
}

// ----------------------------------------------------------------------------

export default {
  name: 'Datasets',
  data() {
    return {
      datasets: [],
      proxyToDelete: null,
    };
  },
  computed: mapState(['proxyManager']),
  created() {
    this.subscriptions = [];
    this.listenerHelper = vtkListenerHelper.newInstance(
      () => {
        this.$nextTick(this.$forceUpdate);
      },
      () => [this.proxyManager].concat(this.proxyManager.getRepresentations())
    );
  },
  mounted() {
    this.$nextTick(this.onMounted);
  },
  beforeDestroy() {
    this.onBeforeDestroy();
  },
  components: {
    ColorByWidget,
    InformationWidget,
    MoleculeWidget,
    RepresentationWidget,
    SliceWidget,
    ColorGroup,
  },
  methods: {
    onMounted,
    onBeforeDestroy,
    deleteDataset,
    getDatasetVisibility,
    toggleDatasetVisibility,
  },
};
