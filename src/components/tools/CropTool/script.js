import { mapState } from 'vuex';

import vtkCropWidget from 'paraview-glance/src/vtk/CropWidget';
import SourceSelect from 'paraview-glance/src/components/widgets/SourceSelect';
import ProxyManagerMixin from 'paraview-glance/src/mixins/ProxyManagerMixin';
import { makeSubManager } from 'paraview-glance/src/utils';

// ----------------------------------------------------------------------------

export default {
  name: 'CropTool',
  components: {
    SourceSelect,
  },
  mixins: [ProxyManagerMixin],
  props: ['enabled'],
  data() {
    return {
      targetVolumeId: -1,
      cropWidget: null,
      canReset: false,
    };
  },
  computed: {
    ...mapState(['proxyManager']),
    targetVolume() {
      return this.proxyManager.getProxyById(this.targetVolumeId);
    },
  },
  watch: {
    enabled(enabled) {
      if (enabled) {
        const cropFilter = this.getCropFilter(this.targetVolume);

        // create crop widget
        // eslint-disable-next-line import/no-named-as-default-member
        this.cropWidget = vtkCropWidget.newInstance();
        this.cropWidget.setFaceHandlesEnabled(false);
        this.cropWidget.setEdgeHandlesEnabled(false);

        // copy image description to widget
        const imageData = this.targetVolume.getDataset();
        this.cropWidget.copyImageDataDescription(imageData);

        // if the crop filter is resettable, that means we have
        // cropping planes to use.
        if (cropFilter.isResetAvailable()) {
          const state = this.cropWidget.getWidgetState().getCroppingPlanes();
          state.setPlanes(cropFilter.getCroppingPlanes());
        }

        // modify crop filter based on widget
        const planesState = this.cropWidget
          .getWidgetState()
          .getCroppingPlanes();
        this.stateSub.sub(
          planesState.onModified(() => {
            cropFilter.setCroppingPlanes(planesState.getPlanes());
            this.canReset = cropFilter.isResetAvailable();
          })
        );

        // add widget to views
        this.proxyManager
          .getViews()
          .forEach((view) => this.addCropToView(view));
      } else {
        this.removeCropWidget();
        this.stateSub.unsub();
      }
    },
    targetVolumeId(id) {
      if (this.enabled) {
        this.disable();

        // handle canReset flag
        if (id !== -1) {
          const cropFilter = this.getCropFilter(this.targetVolume);
          this.canReset = cropFilter.isResetAvailable();
        }
      }
    },
  },
  proxyManager: {
    onProxyRegistrationChange(info) {
      const { proxyGroup, action, proxy } = info;
      if (proxyGroup === 'Views' && action === 'register') {
        if (this.enabled) {
          this.addCropToView(proxy);
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
      const view3d = this.proxyManager
        .getViews()
        .find((v) => v.getProxyName() === 'View3D');

      if (!view3d) {
        throw new Error('Cannot find 3D view!');
      }

      // find volume rep
      const volRep = this.proxyManager.getRepresentation(volProxy, view3d);

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
        if (filter.isResetAvailable()) {
          filter.reset();
          this.canReset = false;

          if (this.cropWidget) {
            const state = this.cropWidget.getWidgetState().getCroppingPlanes();
            state.setPlanes(filter.getCroppingPlanes());
          }
        }
      }
    },
    addCropToView(view) {
      const widgetManager = view.getReferenceByName('widgetManager');
      widgetManager.addWidget(this.cropWidget);

      widgetManager.enablePicking();
      view.renderLater();
    },
    removeCropWidget() {
      if (this.cropWidget) {
        this.proxyManager.getViews().forEach((view) => {
          const widgetManager = view.getReferenceByName('widgetManager');
          if (widgetManager) {
            widgetManager.removeWidget(this.cropWidget);
            view.renderLater();
          }
        });
      }
    },
  },
};
