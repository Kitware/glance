import { mapState } from 'vuex';
import viewHelper from 'paraview-glance/src/components/core/VtkView/helper';
import { DEFAULT_VIEW_TYPE } from 'paraview-glance/src/components/core/VtkView/constants';

const WARNING_KEY = 'BrowserIssues.suppressWarning';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function getBrowserIssues() {
  const view = viewHelper.getView(this.proxyManager, DEFAULT_VIEW_TYPE);
  if (view) {
    const glRW = view.getOpenglRenderWindow();
    const allInfo = glRW.getGLInformations();
    const { UNMASKED_RENDERER, UNMASKED_VENDOR, WEBGL_VERSION } = allInfo;

    if (WEBGL_VERSION.value < 2) {
      this.$set(this.issues, 'webglVersion', WEBGL_VERSION.value);
    }

    const strToTest = `${UNMASKED_VENDOR.value} / ${
      UNMASKED_RENDERER.value
    }`.toLowerCase();
    if (strToTest.indexOf('intel') !== -1) {
      this.$set(this.issues, 'integratedGPU', UNMASKED_RENDERER.value);
    }
    // if (strToTest.indexOf('angle') !== -1) {
    //   this.$set(this.issues, 'angle', true);
    // }
  }

  if (Object.keys(this.issues).length && !this.suppressWarning) {
    this.dialog = true;
  }
}

// ----------------------------------------------------------------------------

function closeDialog() {
  if (this.suppressWarning && window.localStorage) {
    window.localStorage.setItem(WARNING_KEY, true);
  }
  this.dialog = false;
}

// ----------------------------------------------------------------------------

export default {
  name: 'BrowserIssues',
  data() {
    return {
      issues: {},
      dialog: false,
      dontShow: false,
      suppressWarning: false,
    };
  },
  computed: mapState(['proxyManager']),
  created() {
    if (window.localStorage) {
      this.suppressWarning = !!window.localStorage.getItem(WARNING_KEY);
    }
  },
  mounted() {
    this.$nextTick(this.getBrowserIssues);
  },
  methods: {
    closeDialog,
    getBrowserIssues,
  },
};
