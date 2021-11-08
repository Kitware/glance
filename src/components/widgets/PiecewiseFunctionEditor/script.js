import vtkPiecewiseGaussianWidget from '@kitware/vtk.js/Interaction/Widgets/PiecewiseGaussianWidget';

// Act as a semaphore. Only one widget should be the source of changes
// to prevent conflicting update with several instance of that widget
// which would try to adjust to their data range...
let activeWidget = null;

// ----------------------------------------------------------------------------

function onOpacityChange() {
  if (activeWidget) {
    return;
  }
  activeWidget = this.piecewiseWidget;
  const pwfproxy = this.piecewiseFunction;
  if (pwfproxy) {
    pwfproxy.setGaussians(this.piecewiseWidget.getGaussians());

    // Use the opacity range as color range too
    const newColorRange = this.piecewiseWidget.getOpacityRange();
    pwfproxy.getLookupTableProxy().setDataRange(...newColorRange);
  }
  activeWidget = null;
}

// ----------------------------------------------------------------------------

function updateWidget() {
  const pwfProxy = this.piecewiseFunction;
  if (pwfProxy) {
    const lut = pwfProxy.getLookupTableProxy().getLookupTable();
    this.piecewiseWidget.setGaussians(pwfProxy.getGaussians());

    if (this.source) {
      this.piecewiseWidget.setDataArray(
        this.source.getDataset().getPointData().getScalars().getData()
      );
    } else {
      this.piecewiseWidget.setDataArray(
        Float32Array.from(pwfProxy.getDataRange())
      );
    }

    this.piecewiseWidget.setColorTransferFunction(lut);
    this.subscriptions.push(
      lut.onModified(() => {
        if (activeWidget) {
          return;
        }
        activeWidget = this.piecewiseWidget;
        // Use the opacity range as color range too
        const newColorRange = this.piecewiseWidget.getOpacityRange();
        pwfProxy.getLookupTableProxy().setDataRange(...newColorRange);

        this.piecewiseWidget.render();
        activeWidget = null;
      })
    );
    this.piecewiseWidget.render();
  }
}

// ----------------------------------------------------------------------------
// Vue LifeCycle
// ----------------------------------------------------------------------------

function onMounted() {
  this.piecewiseWidget = vtkPiecewiseGaussianWidget.newInstance({
    numberOfBins: 256,
    size: [280, 150],
  });

  this.piecewiseWidget.updateStyle({
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    histogramColor: 'rgba(100, 100, 100, 0.5)',
    strokeColor: 'rgb(0, 0, 0)',
    activeColor: 'rgb(255, 255, 255)',
    handleColor: 'rgb(50, 150, 50)',
    buttonDisableFillColor: 'rgba(255, 255, 255, 0.5)',
    buttonDisableStrokeColor: 'rgba(0, 0, 0, 0.5)',
    buttonStrokeColor: 'rgba(0, 0, 0, 1)',
    buttonFillColor: 'rgba(255, 255, 255, 1)',
    strokeWidth: 2,
    activeStrokeWidth: 3,
    buttonStrokeWidth: 1.5,
    handleWidth: 3,
    iconSize: 0,
    padding: 10,
  });

  this.subscriptions = [];

  this.widgetSubscriptions = [
    this.piecewiseWidget.onOpacityChange(() => {
      this.onOpacityChange();
    }),
    this.piecewiseWidget.onAnimation((animating) => {
      const pwfproxy = this.piecewiseFunction;
      if (pwfproxy) {
        this.proxyManager.setAnimationOnAllViews(animating);
      }
    }),
  ];

  this.piecewiseWidget.setContainer(this.$el);
  this.piecewiseWidget.bindMouseListeners();
  this.updateWidget();
  this.onOpacityChange();
}

// ----------------------------------------------------------------------------

function onBeforeDestroy() {
  while (this.widgetSubscriptions.length) {
    this.widgetSubscriptions.pop().unsubscribe();
  }
  while (this.subscriptions.length) {
    this.subscriptions.pop().unsubscribe();
  }

  this.piecewiseWidget.unbindMouseListeners();
  this.piecewiseWidget.setContainer(null);
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default {
  props: {
    source: {
      type: Object,
    },
    piecewiseFunction: {
      required: true,
      type: Object,
    },
    proxyManager: {
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    onOpacityChange,
    updateWidget,
    onMounted,
  },
  mounted() {
    this.$nextTick(this.onMounted);
  },
  beforeDestroy: onBeforeDestroy,
  updated() {
    while (this.subscriptions.length) {
      this.subscriptions.pop().unsubscribe();
    }
    this.updateWidget();
  },
};
