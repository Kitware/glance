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
      return import(
        /* webpackMode: "eager" */
        `paraview-glance/static/icons/${icon}.svg`
      )
        .then((svg) => {
          // The reason for this conditional assignment is that this mode of dynamic import has
          // different, breaking behavior between webpack 3 and 4. Based on the structure of the
          // object we receive, we attempt to support both behaviors.
          this.svg = svg.default || svg;
        })
        .catch((e) => {
          this.svg = null;
          throw e;
        });
    },
  },
};
