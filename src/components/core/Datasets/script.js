import vtkListenerHelper from 'paraview-glance/src/ListenerHelper';

import ColorByWidget from 'paraview-glance/src/components/widgets/dataset/ColorBy';
import InformationWidget from 'paraview-glance/src/components/widgets/dataset/Information';
import MoleculeWidget from 'paraview-glance/src/components/widgets/dataset/Molecule';
import RepresentationWidget from 'paraview-glance/src/components/widgets/dataset/Representation';
import SliceWidget from 'paraview-glance/src/components/widgets/dataset/SliceControl';

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
  this.proxyManager.deleteProxy(proxy);
  this.proxyManager.renderAllViews();
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
  inject: ['proxyManager'],
  data() {
    return {
      datasets: [],
    };
  },
  created() {
    this.subscriptions = [];
    this.listenerHelper = vtkListenerHelper.newInstance(
      () => {
        this.$nextTick(this.$forceUpdate);
      },
      () => this.proxyManager.getRepresentations()
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
  },
  methods: {
    onMounted,
    onBeforeDestroy,
    deleteDataset,
    getDatasetVisibility,
    toggleDatasetVisibility,
  },
};
