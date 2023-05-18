const subsKey = Symbol('VtkSubscriptionsKey');

export default {
  mounted() {
    this[subsKey] = [];
  },
  beforeDestroy() {
    while (this[subsKey].length) {
      this[subsKey].pop().unsubscribe();
    }
  },
  methods: {
    /**
     * Automatically unsubs a subscription when component is destroyed.
     */
    trackVtkSubscription(sub) {
      this[subsKey].push(sub);
    },
  },
};
