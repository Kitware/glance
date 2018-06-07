let subscriptions = [];

function onMounted() {
  subscriptions = [
    this.proxyManager.onProxyRegistrationChange(({ proxyGroup }) => {
      if (proxyGroup === 'Sources') {
        this.datasets = this.proxyManager.getSources().map((source) => ({
          name: source.getName(),
        }));
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
  methods: {
    onMounted,
    onBeforeDestroy,
  },
};
