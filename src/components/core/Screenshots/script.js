import { Events } from 'paraview-glance/src/constants';

function onScreenshotTaken(screenshot) {
  this.pendingScreenshot = screenshot;
  this.dialogFilename = 'Untitled.png';
  this.dialogVisible = true;
}

function addPendingScreenshot() {
  const screenshot = {
    filename: this.dialogFilename,
    image: this.pendingScreenshot.imgSrc,
  };

  const viewName = this.pendingScreenshot.viewName;
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
}

function getTotalCount() {
  return Object.values(this.screenshots)
    .map((s) => s.length)
    .reduce((total, value) => total + value);
}

export default {
  name: 'Screenshots',
  data() {
    return {
      // viewName::String -> [Screenshot]
      screenshots: {},
      dialogVisible: false,
      dialogFilename: '',
      pendingScreenshot: null,
    };
  },
  methods: {
    onScreenshotTaken,
    addPendingScreenshot,
    deleteScreenshot,
    getTotalCount,
  },
  created() {
    this.$globalBus.$on(Events.SCREENSHOT, this.onScreenshotTaken);
  },
  beforeDestory() {
    this.$globalBus.$off(Events.SCREENSHOT, this.onScreenshotTaken);
  },
};
