export default {
  name: 'FieldDataInformation',
  props: {
    dataset: { required: true },
    name: { type: String },
    type: { type: String, required: true },
  },
  data() {
    return {
      activeFieldName: null,
    };
  },
  mounted() {
    if (this.hasFieldData()) {
      const arrays = this.getFieldData().getArrays();
      this.activeFieldName = arrays[0].getName();
    }
  },
  methods: {
    hasFieldData() {
      return (
        this.dataset[`get${this.type}`] &&
        this.getFieldData().getArrays().length > 0
      );
    },
    getFieldData() {
      return this.dataset[`get${this.type}`]();
    },
    getActiveArray() {
      return this.getFieldData().getArray(this.activeFieldName);
    },
  },
};
