const DATA_TYPES = [
  {
    label: 'Integer 8',
    constructor: Int8Array,
    size: 1,
  },
  {
    label: 'Unsigned Integer 8',
    constructor: Uint8Array,
    size: 1,
  },
  {
    label: 'Integer 16',
    constructor: Int16Array,
    size: 2,
  },
  {
    label: 'Unsigned Integer 16',
    constructor: Uint16Array,
    size: 2,
  },
  {
    label: 'Integer 32',
    constructor: Int32Array,
    size: 4,
  },
  {
    label: 'Unsigned Integer 32',
    constructor: Uint32Array,
    size: 4,
  },
  {
    label: 'Float',
    constructor: Float32Array,
    size: 4,
  },
  {
    label: 'Double',
    constructor: Float64Array,
    size: 8,
  },
];

// ----------------------------------------------------------------------------

function onChange() {
  if (this.effectiveSize === this.file.size) {
    this.$emit('change', {
      dimensions: this.dimensions,
      spacing: this.spacing,
      dataType: this.dataType,
      effectiveSize: this.effectiveSize,
    });
  } else {
    this.$emit('change', null);
  }
}

// ----------------------------------------------------------------------------

export default {
  name: 'RawFileReader',
  props: {
    file: {
      type: File,
      required: true,
    },
  },
  data() {
    return {
      allDataTypes: DATA_TYPES,
      dataType: DATA_TYPES[0],
      dimensions: [1, 1, 1],
      spacing: [1, 1, 1],
    };
  },
  watch: {
    dimensions: onChange,
    spacing: onChange,
    dataType: onChange,
  },
  computed: {
    effectiveSize() {
      return this.dimensions.reduce((t, v) => t * v, 1) * this.dataType.size;
    },
  },
};
