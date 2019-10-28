// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function isClipboardEnabled() {
  try {
    return document.queryCommandSupported('copy');
  } catch (e) {
    return false;
  }
}

// ----------------------------------------------------------------------------

function copyErrorToClipboard() {
  this.$refs.errorTextarea.select();
  if (document.execCommand('copy')) {
    this.copiedToClipboard = true;
    window.setTimeout(() => {
      this.copiedToClipboard = false;
    }, 2000);
  }
}

// ----------------------------------------------------------------------------

export default {
  name: 'ErrorBox',
  props: {
    errors: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      copiedToClipboard: false,
    };
  },
  computed: {
    readableErrors() {
      const version = window.GLANCE_VERSION || 'not available';
      const errorStrings = this.errors
        .map((err) => {
          if (err instanceof ErrorEvent) {
            return err.message;
          }
          return err;
        })
        .join('\n');
      return `ParaViewGlance: ${version}\n${navigator.userAgent}\n\n\`\`\`\n${errorStrings}\n\`\`\``;
    },
  },
  methods: {
    isClipboardEnabled,
    copyErrorToClipboard,
  },
};
