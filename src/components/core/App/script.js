import { mapState, mapActions, mapMutations } from 'vuex';
import Mousetrap from 'mousetrap';
import { VBottomSheet, VDialog } from 'vuetify/lib';
import macro from 'vtk.js/Sources/macro';

import AboutBox from 'paraview-glance/src/components/core/AboutBox';
import BrowserIssues from 'paraview-glance/src/components/core/BrowserIssues';
import ControlsDrawer from 'paraview-glance/src/components/core/ControlsDrawer';
import DragAndDrop from 'paraview-glance/src/components/widgets/DragAndDrop';
import ErrorBox from 'paraview-glance/src/components/core/ErrorBox';
import FileLoader from 'paraview-glance/src/components/core/FileLoader';
import Landing from 'paraview-glance/src/components/core/Landing';
import LayoutView from 'paraview-glance/src/components/core/LayoutView';
import Screenshots from 'paraview-glance/src/components/core/Screenshots';
import StateFileGenerator from 'paraview-glance/src/components/core/StateFileGenerator';
import SvgIcon from 'paraview-glance/src/components/widgets/SvgIcon';
import CollapsibleToolbar from 'paraview-glance/src/components/widgets/CollapsibleToolbar';
import CollapsibleToolbarItem from 'paraview-glance/src/components/widgets/CollapsibleToolbar/Item';

import shortcuts from 'paraview-glance/src/shortcuts';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'App',
  components: {
    AboutBox,
    BrowserIssues,
    CollapsibleToolbar,
    CollapsibleToolbarItem,
    ControlsDrawer,
    DragAndDrop,
    ErrorBox,
    FileLoader,
    Landing,
    LayoutView,
    Screenshots,
    StateFileGenerator,
    SvgIcon,
    VBottomSheet,
    VDialog,
  },
  data() {
    return {
      aboutDialog: false,
      errorDialog: false,
      internalControlsDrawer: true,
      screenshotsDrawer: false,
      screenshotCount: 0,
      errors: [],
    };
  },
  computed: {
    controlsDrawer: {
      get() {
        return this.landingVisible ? false : this.internalControlsDrawer;
      },
      set(visible) {
        if (!this.landingVisible) {
          this.internalControlsDrawer = visible;
        }
      },
    },
    ...mapState({
      loadingState: 'loadingState',
      landingVisible: (state) => state.route === 'landing',
      screenshotsDrawerStateless(state) {
        // Keep screenshot drawer open if screenshot was taken from
        // the "Capture Active View" button.
        return this.screenshotsDrawer && !!state.screenshots.showDialog;
      },
      smallScreen() {
        return this.$vuetify.breakpoint.smAndDown;
      },
      dialogType() {
        return this.smallScreen ? 'v-bottom-sheet' : 'v-dialog';
      },
    }),
  },
  proxyManagerHooks: {
    onProxyModified() {
      if (!this.loadingState) {
        this.$proxyManager.autoAnimateViews();
      }
    },
  },
  mounted() {
    this.initViews();

    // attach keyboard shortcuts
    shortcuts.forEach(({ key, action }) =>
      Mousetrap.bind(key, (e) => {
        e.preventDefault();
        this.$store.dispatch(action);
      })
    );

    // listen for errors
    window.addEventListener('error', this.recordError);

    // listen for vtkErrorMacro
    macro.setLoggerFunction('error', (...args) => {
      this.recordError(args.join(' '));
      window.console.error(...args);
    });
  },
  beforeDestroy() {
    window.removeEventListener('error', this.recordError);
    shortcuts.forEach(({ key }) => Mousetrap.unbind(key));
  },
  methods: {
    ...mapMutations({
      showApp: 'showApp',
      showLanding: 'showLanding',
      toggleLanding() {
        if (this.landingVisible) {
          this.showApp();
        } else {
          this.showLanding();
        }
      },
    }),
    ...mapActions({
      openSample: (dispatch, urls, names) => {
        // dispatch: delete all loaded files since this is only called
        // by clicking on sample data
        dispatch('openRemoteFiles', { urls, names }).then(() =>
          dispatch('resetWorkspace')
        );
      },
      promptUserFiles: 'promptForFiles',
      openFiles: (dispatch, files) => dispatch('openFiles', Array.from(files)),
      saveState: 'saveState',
      initViews: 'initViews',
    }),
    recordError(error) {
      this.errors.push(error);
    },
  },
};
