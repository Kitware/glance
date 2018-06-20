// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default {
  name: 'SvgIcon',
  props: {
    icon: String,
  },
  data() {
    return {
      svg: null,
    };
  },
  watch: {
    icon(icon) {
      if (this.icon) {
        this.importIcon(icon);
      }
    },
  },
  mounted() {
    if (this.icon) {
      this.importIcon(this.icon);
    }
  },
  methods: {
    importIcon(icon) {
      return import(/* webpackMode: "eager" */
      `paraview-glance/static/icons/${icon}.svg`)
        .then(({ default: svg }) => {
          this.svg = svg;
        })
        .catch((e) => {
          this.svg = null;
          throw e;
        });
    },
  },
};
