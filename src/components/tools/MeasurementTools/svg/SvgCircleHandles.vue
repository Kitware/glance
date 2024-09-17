<template>
  <g v-if="visible">
    <circle
      v-for="(pt, idx) in points"
      :key="idx"
      v-bind="$attrs"
      :cx="pt[0]"
      :cy="pt[1]"
    />
  </g>
</template>

<script>
import PixelSpaceMixin from 'paraview-glance/src/mixins/PixelSpaceMixin';
import VtkMixin from 'paraview-glance/src/mixins/VtkMixin';

export default {
  name: 'SvgCircleHandles',
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
  mounted() {
    this.trackVtkSubscription(this.widgetState.onModified(this.updatePoints));
    this.resizeObserver = new ResizeObserver(() => {
      this.updatePoints();
    });
    this.resizeObserver.observe(this.view.getContainer());
  },
  beforeUnmount() {
    this.resizeObserver.disconnect();
  },
  methods: {
    async updatePoints() {
      const handlePoints = this.stateLabels
        .flatMap((label) => this.widgetState.getStatesWithLabel(label))
        .filter(Boolean)
        .filter((state) => state.isVisible())
        .flatMap((state) => state.getOrigin());

      const promise = this.mapToPixelSpace(handlePoints);
      this.view.render();
      this.points = await promise;
    },
  },
};
</script>
