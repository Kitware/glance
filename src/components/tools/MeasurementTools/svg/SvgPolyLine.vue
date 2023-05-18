<template>
  <g v-if="visible">
    <line
      v-for="(line, idx) in lines"
      :key="idx"
      v-bind="$attrs"
      :x1="line[0][0]"
      :y1="line[0][1]"
      :x2="line[1][0]"
      :y2="line[1][1]"
    />
  </g>
</template>

<script>
import PixelSpaceMixin from 'paraview-glance/src/mixins/PixelSpaceMixin';
import VtkMixin from 'paraview-glance/src/mixins/VtkMixin';

export default {
  name: 'SvgPolyLine',
  mixins: [PixelSpaceMixin, VtkMixin],
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    stateLabels: {
      type: Array,
      required: true,
    },
    widgetState: {
      type: Object,
      required: true,
    },
    viewProxyId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      points: [],
    };
  },
  computed: {
    lines() {
      const lines = [];
      for (let i = 0; i < this.points.length - 1; i++) {
        const start = this.points[i];
        const end = this.points[i + 1];
        lines.push([start, end]);
      }
      return lines;
    },
  },
  mounted() {
    this.trackVtkSubscription(this.widgetState.onModified(this.updatePoints));
    this.updatePoints();
  },
  methods: {
    async updatePoints() {
      const handlePoints = this.stateLabels
        .flatMap((label) => this.widgetState.getStatesWithLabel(label))
        .filter(Boolean)
        .filter((state) => state.isVisible())
        .flatMap((state) => state.getOrigin());

      this.points = await this.mapToPixelSpace(handlePoints);
    },
  },
};
</script>
