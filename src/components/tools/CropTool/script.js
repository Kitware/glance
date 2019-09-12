import { mapState } from 'vuex';

import macro from 'vtk.js/Sources/macro';
import vtkImageCroppingWidget from 'vtk.js/Sources/Widgets/Widgets3D/ImageCroppingWidget';

import utils from 'paraview-glance/src/utils';
import ProxyManagerMixin from 'paraview-glance/src/mixins/ProxyManagerMixin';

const { vtkErrorMacro } = macro;
const { makeSubManager, forAllViews } = utils;

function unsubList(list) {
  while (list.length) {
    list.pop().unsubscribe();
  }
}

// ----------------------------------------------------------------------------

export default {
  name: 'CropTool',
  mixins: [ProxyManagerMixin],
  props: ['enabled'],
  data() {
    return {
      targetVolumeId: -1,
      cropWidget: null,
    };
  },
  computed: {
    ...mapState(['proxyManager']),
    targetVolume() {
      return this.proxyManager.getProxyById(this.targetVolumeId);
    },
    volumeSelection() {
      if (this.targetVolume) {
        return {
          name: this.targetVolume.getName(),
          sourceId: this.targetVolume.getProxyId(),
        };
      }
      return null;
    },
  },
  watch: {
    enabled(enabled) {
      if (enabled) {
        const cropFilter = this.getCropFilter(this.targetVolume);

        // create crop widget
        this.cropWidget = vtkImageCroppingWidget.newInstance();
        this.cropWidget.setFaceHandlesEnabled(false);
        this.cropWidget.setEdgeHandlesEnabled(false);

        // copy image description to widget
        const imageData = this.targetVolume.getDataset();
        this.cropWidget.copyImageDataDescription(imageData);

        // modify crop filter based on widget
        const planesState =
          this.cropWidget.getWidgetState().getCroppingPlanes();
        this.stateSub.sub(planesState.onModified(() =>
          cropFilter.setCroppingPlanes(planesState.getPlanes())
        ));

        // add widget to views
        this.proxyManager
          .getViews()
          .forEach((view) => this.addCropToView(view));
      } else {
        this.removeCropWidget();
        this.stateSub.unsub();
      }
    },
  },
  proxyManager: {
    onProxyRegistrationChange(info) {
      const { proxyGroup, action, proxy, proxyId } = info;
      if (proxyGroup === 'Sources') {
        if (action === 'unregister') {
          if (proxyId === this.targetVolumeId) {
            this.targetVolumeId = -1;
          }
          this.disable();
        }
        // update image selection
        this.$forceUpdate();
      } else if (proxyGroup === 'Views' && action === 'register') {
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
    getVolumes() {
      return this.proxyManager
        .getSources()
        .filter((s) => s.getType() === 'vtkImageData')
        .map((s) => ({
          name: s.getName(),
          sourceId: s.getProxyId(),
        }));
    },
    getCropFilter(volProxy) {
      // find volume rep
      const volRep = this.proxyManager
        .getRepresentations()
        .find((rep) => rep.getInputDataSet() === volProxy.getDataset());

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

          if (this.cropWidget) {
            const state = this.cropWidget.getWidgetState().getCroppingPlanes();
            state.setPlanes(filter.getCroppingPlanes());
          }
        }
      }
    },
    addCropToView(view) {
      const widgetManager = view.getReferenceByName('widgetManager');
      const viewWidget = widgetManager.addWidget(this.cropWidget);

      widgetManager.enablePicking();
      view.renderLater();
    },
    removeCropWidget() {
      if (this.cropWidget) {
        this.proxyManager
          .getViews()
          .forEach((view) => {
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
