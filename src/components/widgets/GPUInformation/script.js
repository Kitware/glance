import vtkFPSMonitor from '@kitware/vtk.js/Interaction/UI/FPSMonitor';

// ----------------------------------------------------------------------------

function onMounted() {
  this.monitor = vtkFPSMonitor.newInstance({ bufferSize: this.width });

  this.updateActiveView = () => {
    const view = this.proxyManager.getActiveView();
    const rw = view ? view.getRenderWindow() : null;

    if (view) {
      const glRW = view.getOpenGLRenderWindow();
      const allInfo = glRW.getGLInformations();
      const { UNMASKED_RENDERER, UNMASKED_VENDOR, WEBGL_VERSION } = allInfo;

      this.vendor = UNMASKED_VENDOR.value;
      this.gpu = UNMASKED_RENDERER.value;
      this.webgl = WEBGL_VERSION.value;
    }

    this.monitor.setRenderWindow(rw);
    this.monitor.update();
  };

  window.addEventListener('resize', this.monitor.update);
  this.subscriptions = [
    this.proxyManager.onModified(this.monitor.update).unsubscribe,
    this.proxyManager.onActiveViewChange(this.updateActiveView).unsubscribe,
    () => window.removeEventListener('resize', this.monitor.update),
  ];

  this.monitor.setContainer(this.$el.querySelector('.js-monitor'));
  this.monitor.getFpsMonitorContainer().style.flexDirection = 'column';
  this.updateActiveView();
}

// ----------------------------------------------------------------------------

function onBeforeDestroy() {
  if (this.monitor) {
    this.monitor.delete();
    this.monitor = null;
  }
  while (this.subscriptions.length) {
    this.subscriptions.pop()();
  }
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default {
  props: {
    width: {
      default: 268,
      type: Number,
    },
    proxyManager: {
      required: true,
    },
  },
  data() {
    return {
      vendor: 'Unknown',
      gpu: 'Unknown',
      webgl: 0,
      infoDialog: false,
    };
  },
  methods: {
    onMounted,
  },
  mounted() {
    this.$nextTick(this.onMounted);
  },
  beforeDestroy: onBeforeDestroy,
};
