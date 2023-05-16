<template>
  <g v-if="visible">
    <text
      v-for="(label, idx) in svgSpaceLabels"
      :key="idx"
      v-bind="$attrs"
      :style="styles"
      :abc="JSON.stringify(styles)"
      :x="label.x"
      :y="label.y"
    >
      {{ label.text }}
    </text>
  </g>
</template>

<script>
import PixelSpaceMixin from 'paraview-glance/src/mixins/PixelSpaceMixin';

export default {
  name: 'SvgLabel',
  mixins: [PixelSpaceMixin],
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    labels: {
      type: Array,
      default: () => [],
    },
    viewProxyId: {
      type: String,
      required: true,
    },
    styles: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      svgSpaceLabels: [],
    };
  },
  watch: {
    labels() {
      this.updatePoints();
      this.view.renderLater();
    },
  },
  mounted() {
    this.updatePoints();
  },
  methods: {
    async updatePoints() {
      const points = this.labels.flatMap((label) => label.xyz);
      const pixelPoints = await this.mapToPixelSpace(points);
      this.svgSpaceLabels = pixelPoints.map((coord, idx) => {
        return {
          x: coord[0],
          y: coord[1],
          text: this.labels[idx].text,
        };
      });
    },
  },
};
</script>
