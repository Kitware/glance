import ColorByWidget from 'paraview-glance/src/components/widgets/dataset/ColorBy';
import InformationWidget from 'paraview-glance/src/components/widgets/dataset/Information';
import RepresentationWidget from 'paraview-glance/src/components/widgets/dataset/Representation';
import SliceWidget from 'paraview-glance/src/components/widgets/dataset/SliceControl';

function onMounted() {
  this.subscriptions = [
    this.proxyManager.onProxyRegistrationChange(({ proxyGroup }) => {
      if (proxyGroup === 'Sources') {
        this.datasets = this.proxyManager.getSources();
      }
    }),
  ];
}

function onBeforeDestroy() {
  while (subscriptions.length) {
    subscriptions.pop().unsubscribe();
  }
}

export default {
  name: 'App',
  inject: ['proxyManager'],
  data: () => ({
    datasets: [],
  }),
  mounted() {
    this.$nextTick(this.onMounted);
  },
  beforeDestroy() {
    this.onBeforeDestroy();
  },
  components: {
    ColorByWidget,
    InformationWidget,
    RepresentationWidget,
    SliceWidget,
  },
  methods: {
    onMounted,
    onBeforeDestroy,
  },
};
