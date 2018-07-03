import Vue from 'vue';
import vtkProxyManager from 'vtk.js/Sources/Proxy/Core/ProxyManager';

import Config from 'paraview-glance/src/config';
import AboutBox from 'paraview-glance/src/components/core/AboutBox';
import BrowserIssues from 'paraview-glance/src/components/core/BrowserIssues';
import ControlsDrawer from 'paraview-glance/src/components/core/ControlsDrawer';
import CropWidget from 'paraview-glance/src/vtkwidgets/CropWidget';
import DragAndDrop from 'paraview-glance/src/components/widgets/DragAndDrop';
import ErrorBox from 'paraview-glance/src/components/core/ErrorBox';
import FileLoader from 'paraview-glance/src/components/core/FileLoader';
import Landing from 'paraview-glance/src/components/core/Landing';
import LayoutView from 'paraview-glance/src/components/core/LayoutView';
import Notification from 'paraview-glance/src/components/core/Notification';
import Screenshots from 'paraview-glance/src/components/core/Screenshots';
import StateFileGenerator from 'paraview-glance/src/components/core/StateFileGenerator';
import SvgIcon from 'paraview-glance/src/components/widgets/SvgIcon';
import vtkListenerHelper from 'paraview-glance/src/ListenerHelper';
import vtkWidgetManager from 'paraview-glance/src/vtkwidgets/WidgetManager';
import { Widgets } from 'paraview-glance/src/constants';

export const $globalBus = new Vue();

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
  provide: {
    $globalBus,
  },
  props: {
    route: {
      type: String,
      required: false,
    },
    proxyManager: {
      required: false,
    },
  },
  data() {
    let proxyManager = this.proxyManager;
    if (!proxyManager) {
      proxyManager = vtkProxyManager.newInstance({ proxyConfiguration });
    }

    const renderListener = vtkListenerHelper.newInstance(
      proxyManager.autoAnimateViews,
      () =>
        [].concat(
          proxyManager.getSources(),
          proxyManager.getRepresentations(),
          proxyManager.getViews()
        )
    );
    proxyManager.onProxyRegistrationChange(renderListener.resetListeners);

    const widgetManager = vtkWidgetManager.newInstance({ proxyManager });
    widgetManager.registerWidgetGroup(Widgets.CROP, CropWidget);

    return {
      // start with landing as default
      internalRoute: this.route || 'landing',
      internalProxyManager: proxyManager,
      widgetManager,
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
  mounted() {
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
    recordError(error) {
      this.errors.push(error);
    },
    promptUserFiles() {
      $globalBus.$emit('prompt-user-files');
    },
    openUrls(urls, names) {
      $globalBus.$emit('open-remote-files', urls, names);
    },
    openFiles(files) {
      $globalBus.$emit('open-files', files);
    },
    saveState() {
      $globalBus.$emit('save-state');
    },
  },
};
