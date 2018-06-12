import { Events } from 'paraview-glance/src/constants';

function onScreenshotTaken(screenshot) {
  this.screenshot = screenshot;
  this.filename = 'Untitled.png';
  this.visible = true;
}

function save() {
  this.$emit('save', this.screenshot.viewName, {
    image: this.screenshot.imgSrc,
    filename: this.filename,
  });
}

export default {
  name: 'ScreenshotDialog',
  data() {
    return {
      screenshot: null,
      filename: '',
      visible: false,
    };
  },
  methods: {
    onScreenshotTaken,
    save,
  },
  created() {
    this.$globalBus.$on(Events.SCREENSHOT, this.onScreenshotTaken);
  },
  beforeDestory() {
    this.$globalBus.$off(Events.SCREENSHOT, this.onScreenshotTaken);
  },
};
