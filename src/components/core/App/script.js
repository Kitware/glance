import AboutBox from 'paraview-glance/src/components/core/AboutBox';
import BrowserIssues from 'paraview-glance/src/components/core/BrowserIssues';
import ControlsDrawer from 'paraview-glance/src/components/core/ControlsDrawer';
import DragAndDrop from 'paraview-glance/src/components/widgets/DragAndDrop';
import ErrorBox from 'paraview-glance/src/components/core/ErrorBox';
import FileLoader from 'paraview-glance/src/components/core/FileLoader';
import Landing from 'paraview-glance/src/components/core/Landing';
import LayoutView from 'paraview-glance/src/components/core/LayoutView';
import Notification from 'paraview-glance/src/components/core/Notification';
import Screenshots from 'paraview-glance/src/components/core/Screenshots';
import StateFileGenerator from 'paraview-glance/src/components/core/StateFileGenerator';
import SvgIcon from 'paraview-glance/src/components/widgets/SvgIcon';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'App',
  components: {
    AboutBox,
    BrowserIssues,
    ControlsDrawer,
    DragAndDrop,
    ErrorBox,
    FileLoader,
    Landing,
    LayoutView,
    Notification,
    Screenshots,
    StateFileGenerator,
    SvgIcon,
  },
  props: {
    route: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      // start with landing as default
      internalRoute: this.route || 'landing',
      aboutDialog: false,
      errorDialog: false,
      controlsDrawer: true,
      screenshotsDrawer: false,
      screenshotCount: 0,
      errors: [],
    };
  },
  computed: {
    landingVisible() {
      return this.internalRoute === 'landing';
    },
  },
  watch: {
    route(val) {
      this.internalRoute = val;
    },
    internalRoute(val) {
      if (this.internalRoute !== this.route) {
        this.$emit('route', val);
      }
    },
  },
  // watch: {
  //   landing(landing) {
  //     window.location.hash = landing ? '' : '#app';
  //   },
  // },
  mounted() {
    // window.addEventListener('hashchange', this.navigate);
    window.addEventListener('error', this.recordError);

    if (window.console) {
      this.origConsoleError = window.console.error;
      window.console.error = (...args) => {
        this.recordError(args.join(' '));
        return this.origConsoleError(...args);
      };
    }
  },
  beforeDestroy() {
    // window.removeEventListener('hashchange', this.navigate);
    window.removeEventListener('error', this.recordError);

    if (this.origConsoleError) {
      window.console.error = this.origConsoleError;
    }
  },
  methods: {
    showLanding() {
      this.internalRoute = 'landing';
    },
    showApp() {
      this.internalRoute = 'app';
    },
    // navigate() {
    //   this.landing = window.location.hash !== '#app';
    // },
    recordError(error) {
      this.errors.push(error);
    },
    promptUserFiles() {
      this.$globalBus.$emit('prompt-user-files');
    },
    openUrls(urls, names) {
      this.$globalBus.$emit('open-remote-files', urls, names);
    },
    openFiles(files) {
      this.$globalBus.$emit('open-files', files);
    },
    saveState() {
      this.$globalBus.$emit('save-state');
    },
  },
};
