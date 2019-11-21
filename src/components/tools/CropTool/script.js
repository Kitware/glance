import SourceSelect from 'paraview-glance/src/components/widgets/SourceSelect';
import { makeSubManager } from 'paraview-glance/src/utils';

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
            cropFilter.setCroppingPlanes(planesState.getPlanes());
            this.canReset = cropFilter.isResetAvailable();
          })
        );

        cropProxy.addToViews();
      } else {
        this.$proxyManager.deleteProxy(this.cropProxy);
        this.widgetId = -1;
        this.stateSub.unsub();
      }
    },
    targetVolumeId(id) {
      if (this.enabled) {
        this.disable();

        // handle canReset flag
        this.canReset = false;
        if (id !== -1) {
          const cropFilter = this.getCropFilter(this.targetVolume);
          this.canReset = cropFilter.isResetAvailable();
        }
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
      return source && source.getType() === 'vtkImageData';
    },
    getCropFilter(volProxy) {
      // find 3d view
      const view3d = this.$proxyManager
        .getViews()
        .find((v) => v.getProxyName() === 'View3D');

      if (!view3d) {
        throw new Error('Cannot find 3D view!');
      }

      // find volume rep
      const volRep = this.$proxyManager.getRepresentation(volProxy, view3d);

      if (!volRep || !volRep.getCropFilter) {
        throw new Error('Cannot find the volume rep with a crop filter!');
      }

      return volRep.getCropFilter();
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
  },
};
