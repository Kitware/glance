import ScreenshotDialog from 'paraview-glance/src/components/core/Screenshots/ScreenshotDialog';

function addScreenshot(viewName, screenshot) {
  if (!(viewName in this.screenshots)) {
    this.$set(this.screenshots, viewName, []);
  }
  this.screenshots[viewName].push(screenshot);

  const totalCount = this.getTotalCount();
  this.$emit('screenshot-count', totalCount);
}

function deleteScreenshot(viewName, index) {
  if (this.screenshots[viewName]) {
    this.screenshots[viewName].splice(index, 1);
  }

  const totalCount = this.getTotalCount();
  this.$emit('screenshot-count', totalCount);
}

function getTotalCount() {
  return Object.values(this.screenshots)
    .map((s) => s.length)
    .reduce((total, value) => total + value);
}

export default {
  name: 'Screenshots',
  components: {
    ScreenshotDialog,
  },
  data() {
    return {
      // viewName::String -> [Screenshot]
      screenshots: {},
    };
  },
  methods: {
    addScreenshot,
    deleteScreenshot,
    getTotalCount,
  },
};
