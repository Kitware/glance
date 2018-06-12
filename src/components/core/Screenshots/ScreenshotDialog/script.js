import { Events } from 'paraview-glance/src/constants';

function onScreenshotTaken(screenshot) {
  this.screenshot = screenshot;
  this.filename = 'Untitled.png';
  this.visible = true;
  this.generateImage();
}

function generateImage() {
  const img = new Image();
  img.addEventListener('load', () => {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvas.width = img.width;
    this.canvas.height = img.height;

    if (!this.transparentBackground) {
      ctx.fillStyle = this.backgroundToFillStyle(
        this.screenshot.viewData.background
      );
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    this.previewImageURL = this.canvas.toDataURL();
  });

  img.src = this.screenshot.imgSrc;
}

function backgroundToFillStyle(bg) {
  if (bg.startsWith('linear-gradient(')) {
    // parse out linear gradient, assumed to be top-bottom
    const stops = bg.substring(bg.indexOf('(') + 1, bg.indexOf(')')).split(',');

    const ctx = this.canvas.getContext('2d');
    // top to bottom
    const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, stops[0]);
    gradient.addColorStop(1, stops[1]);
    return gradient;
  }
  // we currently don't handle images or any other background value
  return bg;
}

function save() {
  this.$emit('save', this.screenshot.viewName, {
    image: this.canvas.toDataURL(),
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
      previewImageURL: '',
      transparentBackground: false,
    };
  },
  watch: {
    transparentBackground: generateImage,
  },
  methods: {
    onScreenshotTaken,
    generateImage,
    backgroundToFillStyle,
    save,
  },
  created() {
    this.canvas = document.createElement('canvas');
    this.$globalBus.$on(Events.SCREENSHOT, this.onScreenshotTaken);
  },
  beforeDestory() {
    this.$globalBus.$off(Events.SCREENSHOT, this.onScreenshotTaken);
  },
};
