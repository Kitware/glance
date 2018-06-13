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
    };
  },
  methods: {
    addScreenshot,
    deleteScreenshot,
    viewScreenshot,
    getTotalCount,
  },
};
