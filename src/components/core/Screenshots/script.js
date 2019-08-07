import { mapState } from 'vuex';

import ScreenshotDialog from 'paraview-glance/src/components/core/Screenshots/ScreenshotDialog';
import { Actions } from 'paraview-glance/src/store/types';

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

function takeScreenshot() {
  this.$store.dispatch(Actions.TAKE_SCREENSHOT, this.activeView);
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
      activeView: null,
    };
  },
  computed: Object.assign(mapState(['proxyManager']), {
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
  }),
  methods: {
    addScreenshot,
    deleteScreenshot,
    viewScreenshot,
    getTotalCount,
    takeScreenshot,
  },
  mounted() {
    this.subscription = this.proxyManager.onActiveViewChange((view) => {
      this.activeView = view;
    });
  },
  beforeDestroy() {
    this.subscription.unsubscribe();
  },
};
