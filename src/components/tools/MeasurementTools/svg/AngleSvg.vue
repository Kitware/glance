<template>
  <g v-if="visible">
    <svg-circle-handles
      :state-labels="['handles', 'moveHandle']"
      :widget-state="widgetState"
      :view-proxy-id="viewProxyId"
      :stroke="color"
      stroke-width="3"
      fill="transparent"
      r="8"
    />
    <svg-poly-line
      :state-labels="['handles', 'moveHandle']"
      :widget-state="widgetState"
      :view-proxy-id="viewProxyId"
      :stroke="color"
      stroke-width="2"
    />
    <svg-label
      :labels="svgLabels"
      :view-proxy-id="viewProxyId"
      :fill="color"
      dx="12"
      dy="-12"
      :styles="{ fontSize: `${fontSize}px` }"
    />
  </g>
</template>

<script>
import SvgCircleHandles from 'paraview-glance/src/components/tools/MeasurementTools/svg/SvgCircleHandles';
import SvgPolyLine from 'paraview-glance/src/components/tools/MeasurementTools/svg/SvgPolyLine';
import SvgLabel from 'paraview-glance/src/components/tools/MeasurementTools/svg/SvgLabel';
import VtkMixin from 'paraview-glance/src/mixins/VtkMixin';

export default {
  name: 'AngleSvg',
  components: {
    SvgCircleHandles,
    SvgPolyLine,
    SvgLabel,
  },
  mixins: [VtkMixin],
  props: {
    finalized: Boolean,
    widgetState: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    viewProxyId: {
      type: String,
      required: true,
    },
    toolName: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    textSize: {
      type: Number,
      required: true,
    },
    measurements: {
      type: Object,
      required: true,
    },
    labels: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      svgLabels: [],
    };
  },
  computed: {
    angleValue() {
      return this.measurements[this.labels[0]];
    },
    fontSize() {
      return this.textSize * (window.devicePixelRatio || 1);
    },
  },
  watch: {
    angleValue() {
      this.updateLabels();
    },
  },
  mounted() {
    this.trackVtkSubscription(this.widgetState.onModified(this.updateLabels));
    this.updateLabels();
  },
  methods: {
    updateLabels() {
      const handles = this.widgetState
        .getHandleList()
        .map((h) => h.getOrigin());
      if (handles.length === 3) {
        this.svgLabels = [
          {
            xyz: handles[1],
            text: this.angleValue,
          },
        ];
      }
    },
  },
};
</script>
