import Vue from 'vue';

import AboutBox from 'paraview-glance/src/components/core/AboutBox';
import BrowserIssues from 'paraview-glance/src/components/core/BrowserIssues';
import ControlsDrawer from 'paraview-glance/src/components/core/ControlsDrawer';
import CropWidget from 'paraview-glance/src/vtkwidgets/CropWidget';
import DragAndDrop from 'paraview-glance/src/components/widgets/DragAndDrop';
import ErrorBox from 'paraview-glance/src/components/core/ErrorBox';
import FileLoader from 'paraview-glance/src/components/core/FileLoader';
import Landing from 'paraview-glance/src/components/core/Landing';
import LayoutView from 'paraview-glance/src/components/core/LayoutView';
import Screenshots from 'paraview-glance/src/components/core/Screenshots';
import StateFileGenerator from 'paraview-glance/src/components/core/StateFileGenerator';
import SvgIcon from 'paraview-glance/src/components/widgets/SvgIcon';
import vtkListenerHelper from 'paraview-glance/src/ListenerHelper';
import vtkWidgetManager from 'paraview-glance/src/vtkwidgets/WidgetManager';
import { Widgets } from 'paraview-glance/src/constants';
import mTypes from 'paraview-glance/src/stores/mutation-types';
import aTypes from 'paraview-glance/src/stores/action-types';

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
    Screenshots,
    StateFileGenerator,
    SvgIcon,
  },
  props: {
    widgetManager: {
      required: false,
      default() {
        const widgetManager = vtkWidgetManager.newInstance({
          proxyManager: this.proxyManager,
        });
        widgetManager.registerWidgetGroup(Widgets.CROP, CropWidget);
        return widgetManager;
      },
    },
  },
  data() {
    return {
      aboutDialog: false,
      errorDialog: false,
      controlsDrawer: true,
      screenshotsDrawer: false,
      screenshotCount: 0,
      errors: [],
    };
  },
  computed: {
    proxyManager() {
      return this.$store.state.proxyManager;
    },
    landingVisible() {
      return this.$store.state.route === 'landing';
    },
  },
  mounted() {
    this.renderListener = vtkListenerHelper.newInstance(
      this.proxyManager.autoAnimateViews,
      () =>
        [].concat(
          this.proxyManager.getSources(),
          this.proxyManager.getRepresentations(),
          this.proxyManager.getViews()
        )
    );
    this.pxmSub = this.proxyManager.onProxyRegistrationChange(
      this.renderListener.resetListeners
    );

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

    this.pxmSub.unsubscribe();
    this.renderListener.removeListeners();
  },
  methods: {
    showApp() {
      this.$store.commit(mTypes.SHOW_APP);
    },
    showLanding() {
      this.$store.commit(mTypes.SHOW_LANDING);
    },
    recordError(error) {
      this.errors.push(error);
    },
    promptUserFiles() {
      this.$store.dispatch('files/promptForFiles');
    },
    openUrls(urls, names) {
      this.$store.dispatch('files/openRemoteFiles', { urls, names });
    },
    openFiles(files) {
      this.$store.dispatch('files/openFiles', files);
    },
    saveState() {
      this.$store.dispatch(aTypes.SAVE_STATE);
    },
  },
};
