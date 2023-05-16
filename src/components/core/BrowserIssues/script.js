import { mapState, mapActions } from 'vuex';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function getBrowserIssues() {
  const view = this.$proxyManager.getViews()[0];
  if (view) {
    const glRW = view.getOpenGLRenderWindow();
    const allInfo = glRW.getGLInformations();
    const { UNMASKED_RENDERER, UNMASKED_VENDOR, WEBGL_VERSION } = allInfo;

    if (WEBGL_VERSION.value < 2) {
      this.$set(this.issues, 'webglVersion', WEBGL_VERSION.value);
    }

    const strToTest =
      `${UNMASKED_VENDOR.value} / ${UNMASKED_RENDERER.value}`.toLowerCase();
    if (strToTest.indexOf('intel') !== -1) {
      this.$set(this.issues, 'integratedGPU', UNMASKED_RENDERER.value);
    }
    // if (strToTest.indexOf('angle') !== -1) {
    //   this.$set(this.issues, 'angle', true);
    // }
  }

  if (Object.keys(this.issues).length && !this.suppressBrowserWarning) {
    this.dialog = true;
  }
}

// ----------------------------------------------------------------------------

export default {
  name: 'BrowserIssues',
  data() {
    return {
      issues: {},
      dialog: false,
    };
  },
  computed: mapState(['suppressBrowserWarning']),
  mounted() {
    this.getBrowserIssues();
  },
  methods: {
    getBrowserIssues,
    ...mapActions({
      setSuppressBrowserWarning: 'suppressBrowserWarning',
    }),
  },
};
