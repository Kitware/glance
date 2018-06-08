import { REPRESENTATION_TYPES, REPRESENTATION_PROXY_VALUES } from 'paraview-glance/src/components/widgets/dataset/Representation/constants';

// ----------------------------------------------------------------------------

function getRepresentationType() {
  const activeRep = this.proxyManager.getRepresentation(this.source);
  if (!activeRep) {
    return REPRESENTATION_TYPES[1].value;
  }
  const state = activeRep.get('representation', 'visibility');
  if (!state.visibility) {
    return REPRESENTATION_TYPES[0].value;
  }
  return `${REPRESENTATION_PROXY_VALUES.indexOf(state.representation)}`;
}

// ----------------------------------------------------------------------------

function setRepresentationType(newValue) {
  const activeRep = this.proxyManager.getRepresentation(this.source);
  const idx = Number(newValue);
  if (idx) {
    activeRep.setVisibility(true);
    activeRep.setRepresentation(REPRESENTATION_PROXY_VALUES[idx]);
  } else {
    activeRep.setVisibility(false);
  }
  this.$forceUpdate();
}

// ----------------------------------------------------------------------------

function getPointSize() {
  const activeRep = this.proxyManager.getRepresentation(this.source);
  if (activeRep) {
    return activeRep.getPointSize();
  }
  return 1;
}

// ----------------------------------------------------------------------------

function setPointSize(newValue) {
  const activeRep = this.proxyManager.getRepresentation(this.source);
  if (activeRep) {
    activeRep.setPointSize(Number(newValue));
    this.$forceUpdate();
  }
}

// ----------------------------------------------------------------------------

function getOpacity() {
  const activeRep = this.proxyManager.getRepresentation(this.source);
  if (activeRep) {
    return activeRep.getOpacity();
  }
  return 1;
}

// ----------------------------------------------------------------------------

function setOpacity(newValue) {
  const activeRep = this.proxyManager.getRepresentation(this.source);
  if (activeRep) {
    activeRep.setOpacity(Number(newValue));
    this.$forceUpdate();
  }
}

// ----------------------------------------------------------------------------

export default {
  inject: ['proxyManager'],
  props: ['source'],
  methods: {
    getRepresentationType,
    setRepresentationType,
    getPointSize,
    setPointSize,
    getOpacity,
    setOpacity,
  },
  data() {
    return {
      representationTypes: REPRESENTATION_TYPES,
    };
  },
  computed: {
    available() {
      const result = {
        all: true,
        polydata: false,
        imagedata: false,
      };
      if (this.source) {
        const ds = this.source.getDataset();
        if (ds && ds.isA) {
          result.polydata = ds.isA('vtkPolyData');
          result.imagedata = ds.isA('vtkImageData');
        }
      }
      return result;
    }
  }
};
