let subscriptions = [];

// ----------------------------------------------------------------------------
// Component methods
// ----------------------------------------------------------------------------

function getView(type, name) {
  let view = null;
  const views = this.proxyManager.getViews();
  for (let i = 0; i < views.length; i++) {
    if (views[i].getProxyName() === type) {
      if (name) {
        if (views[i].getReferenceByName('name') === name) {
          view = views[i];
        }
      } else {
        view = views[i];
      }
    }
  }

  if (!view) {
    view = this.proxyManager.createProxy('Views', 'View3D', { name });
  }

  return view;
}

function onMounted() {
  const container = this.$el;

  this.view = this.getView(this.proxyManager, 'View3D');
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
  this.view.setContainer(null);
  while (subscriptions.length) {
    subscriptions.pop().unsubscribe();
  }
}

export default {
  inject: ['proxyManager'],
  data: () => ({
    view: null,
  }),
  methods: {
    onMounted,
    getView,
  },
  mounted() {
    this.$nextTick(this.onMounted);
  },
  beforeDestroy: onBeforeDestroy,
};
