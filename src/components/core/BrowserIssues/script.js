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
      this.issues.push(
        `Detected WebGL version ${
          WEBGL_VERSION.value
        }. (Slower Volume/Glyph rendering)`
      );
    }

    const strToTest = `${UNMASKED_VENDOR.value} / ${
      UNMASKED_RENDERER.value
    }`.toLowerCase();
    if (strToTest.indexOf('intel') !== -1) {
      this.issues.push(
        `Detected GPU "${
          UNMASKED_RENDERER.value
        }". Dedicated GPU would offer better performance.`
      );
    }
    if (strToTest.indexOf('angle') !== -1) {
      this.issues.push(
        `ANGLE is used to translate OpenGL for your hardware, so expect slower rendering.`
      );
    }
  }

  if (this.issues.length && !this.suppressWarning) {
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
  props: {
    proxyManager: { required: true },
  },
  data() {
    return {
      issues: [],
      dialog: false,
      dontShow: false,
      suppressWarning: false,
    };
  },
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
