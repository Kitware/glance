import { mapState, mapActions } from 'vuex';

import SourceSelect from 'paraview-glance/src/components/widgets/SourceSelect';
import { getCropFilter, makeSubManager } from 'paraview-glance/src/utils';

// ----------------------------------------------------------------------------

export default {
  name: 'CropTool',
  components: {
    SourceSelect,
  },
  props: ['enabled'],
  data() {
    return {
      targetVolumeId: -1,
      widgetId: -1,
      canReset: false,
    };
  },
  computed: {
    targetVolume() {
      return this.$proxyManager.getProxyById(this.targetVolumeId);
    },
    cropProxy() {
      return this.$proxyManager.getProxyById(this.widgetId);
    },
    canCrop() {
      return this.targetVolumeId > -1;
    },
    ...mapState('widgets', {
      allCropStates: 'croppingStates',
    }),
  },
  watch: {
    enabled(enabled) {
      if (enabled) {
        const cropFilter = this.getCropFilter(this.targetVolume);

        let cropProxy = this.cropProxy;
        if (!cropProxy) {
          cropProxy = this.$proxyManager
            .getProxyInGroup('Widgets')
            .find((w) => w.getProxyName() === 'Crop');
          if (!cropProxy) {
            cropProxy = this.$proxyManager.createProxy('Widgets', 'Crop');
          }
          this.widgetId = cropProxy.getProxyId();
        }

        const widget = cropProxy.getWidget();
        const widgetState = cropProxy.getWidgetState();

        // init
        widget.setFaceHandlesEnabled(false);
        widget.setEdgeHandlesEnabled(false);

        // copy image description to widget
        const imageData = this.targetVolume.getDataset();
        widget.copyImageDataDescription(imageData);

        // set widget bounds
        widget.placeWidget(imageData.getBounds());

        // if the crop filter is resettable, that means we have
        // cropping planes to use.
        if (cropFilter.isResetAvailable()) {
          const state = widgetState.getCroppingPlanes();
          state.setPlanes(cropFilter.getCroppingPlanes());
        }

        // modify crop filter based on widget
        const planesState = widgetState.getCroppingPlanes();
        this.stateSub.sub(
          planesState.onModified(() => {
            const planes = planesState.getPlanes();
            cropFilter.setCroppingPlanes(planes);
            this.canReset = cropFilter.isResetAvailable();
            this.storeCropState(this.targetVolumeId, planes);
          })
        );

        cropProxy.addToViews();
      } else {
        this.cropProxy.removeFromViews();
        this.$proxyManager.deleteProxy(this.cropProxy);
        this.widgetId = -1;
        this.stateSub.unsub();
      }
    },
    targetVolumeId(id) {
      if (this.enabled) {
        this.disable();
      }

      // handle canReset flag
      this.canReset = false;
      if (id !== -1) {
        const cropFilter = this.getCropFilter(this.targetVolume);
        this.canReset = cropFilter.isResetAvailable();
      }
    },
  },
  mounted() {
    this.stateSub = makeSubManager();
  },
  beforeDestroy() {
    this.stateSub.unsub();
  },
  methods: {
    filterImages(source) {
      return (
        source.getProxyName() === 'TrivialProducer' &&
        source.getType() === 'vtkImageData'
      );
    },
    getCropFilter(volProxy) {
      return getCropFilter(this.$proxyManager, volProxy);
    },
    setTargetVolume(sourceId) {
      this.targetVolumeId = sourceId;
    },
    enable() {
      this.$emit('enable', true);
    },
    disable() {
      this.$emit('enable', false);
    },
    reset() {
      if (this.targetVolume) {
        const filter = this.getCropFilter(this.targetVolume);
        filter.reset();
        this.canReset = false;

        if (this.cropProxy) {
          const state = this.cropProxy.getWidgetState().getCroppingPlanes();
          state.setPlanes(filter.getCroppingPlanes());
        }
      }
    },
    storeCropState(datasetId, planes) {
      this.setCroppingState({ datasetId, planes });
    },

    ...mapActions('widgets', ['setCroppingState']),
  },
};
