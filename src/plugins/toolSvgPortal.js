class ToolSvgPortal extends EventTarget {
  constructor() {
    super();
    this.targets = [];
  }

  addTarget(target) {
    this.targets.push(target);
    this.dispatchEvent(new CustomEvent('updateTargets'));
  }

  removeTarget(target) {
    const idx = this.targets.indexOf(target);
    if (idx > -1) {
      this.targets.splice(idx, 1);
      this.dispatchEvent(new CustomEvent('updateTargets'));
    }
  }
}

const ToolSvgPortalPlugin = {
  install(Vue) {
    const svgPortal = new ToolSvgPortal();
    Vue.mixin({
      beforeCreate() {
        this.$toolSvgPortal = svgPortal;
      },
    });
  },
};

export default ToolSvgPortalPlugin;
