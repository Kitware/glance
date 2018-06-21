// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function getBrowserIssues() {
  const webglVersion = 3333;
  if (webglVersion === 1) {
    this.issues.push('WebGL version is 1.0, expected at least 2.0');
  }

  if (this.issues.length) {
    this.dialog = true;
  }
}

// ----------------------------------------------------------------------------

export default {
  name: 'BrowserIssues',
  data() {
    return {
      issues: [],
      dialog: false,
    };
  },
  mounted() {
    this.$nextTick(this.getBrowserIssues);
  },
  methods: {
    getBrowserIssues,
  },
};
