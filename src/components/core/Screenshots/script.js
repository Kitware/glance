import { mapActions } from 'vuex';

import ScreenshotDialog from 'paraview-glance/src/components/core/Screenshots/ScreenshotDialog';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function addScreenshot(viewName, screenshot) {
  if (!(viewName in this.screenshots)) {
    this.$set(this.screenshots, viewName, []);
  }
  this.screenshots[viewName].push(screenshot);

  const totalCount = this.getTotalCount();
  this.$emit('screenshot-count', totalCount);
}

// ----------------------------------------------------------------------------

function deleteScreenshot(viewName, index) {
  if (this.screenshots[viewName]) {
    this.screenshots[viewName].splice(index, 1);
  }

  const totalCount = this.getTotalCount();
  this.$emit('screenshot-count', totalCount);
}

// ----------------------------------------------------------------------------

function viewScreenshot(viewName, index) {
  if (this.screenshots[viewName]) {
    const screenshot = this.screenshots[viewName][index];
    const image = new Image();
    image.src = screenshot.image;
    const w = window.open('', '_blank');
    w.document.write(image.outerHTML);
    w.document.title = screenshot.filename;
    window.focus();
  }
}

// ----------------------------------------------------------------------------

function getTotalCount() {
  return Object.values(this.screenshots)
    .map((s) => s.length)
    .reduce((total, value) => total + value);
}

// ----------------------------------------------------------------------------

export default {
  name: 'Screenshots',
  components: {
    ScreenshotDialog,
  },
  data() {
    return {
      // viewName::String -> [Screenshot]
      screenshots: {},
      activeViewId: -1,
    };
  },
  computed: {
    atLeastOneScreenshot() {
      const names = Object.keys(this.screenshots);
      for (let i = 0; i < names.length; ++i) {
        const list = this.screenshots[names[i]];
        if (list && list.length) {
          return true;
        }
      }
      return false;
    },
    smallScreen() {
      // vuetify xs is 600px, but our buttons collide at around 700.
      return this.$vuetify.breakpoint.smAndDown;
    },
    activeView() {
      return this.$proxyManager.getProxyById(this.activeViewId);
    },
  },
  proxyManagerHooks: {
    onActiveViewChange(view) {
      this.activeViewId = view.getProxyId();
    },
  },
  mounted() {
    const activeView = this.$proxyManager.getActiveView();
    if (activeView) {
      this.activeViewId = activeView.getProxyId();
    }
  },
  methods: {
    addScreenshot,
    deleteScreenshot,
    viewScreenshot,
    getTotalCount,
    ...mapActions({
      takeScreenshot(dispatch) {
        return dispatch('takeScreenshot', this.activeView);
      },
    }),
  },
};
