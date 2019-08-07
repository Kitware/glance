import { mapState, mapActions, mapMutations } from 'vuex';
import Mousetrap from 'mousetrap';

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
import { Actions, Mutations } from 'paraview-glance/src/store/types';
import shortcuts from 'paraview-glance/src/shortcuts';

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
      controlsDrawer: false,
      screenshotsDrawer: false,
      screenshotCount: 0,
      errors: [],
    };
  },
  computed: mapState({
    proxyManager: 'proxyManager',
    loadingState: 'loadingState',
    landingVisible: (state) => state.route === 'landing',
    screenshotsDrawerStateless(state) {
      // Keep screenshot drawer open if screenshot was taken from
      // the "Capture Active View" button.
      return this.screenshotsDrawer && !!state.screenshots.showDialog;
    },
    smallScreen() {
      // vuetify xs is 600px, but our buttons collide at around 700.
      return this.$vuetify.breakpoint.smAndDown;
    },
    dialogType() {
      return this.smallScreen ? 'v-bottom-sheet' : 'v-dialog';
    },
    iconLogo() {
      return this.smallScreen ? 'paraview-glance-small' : 'paraview-glance';
    },
  }),
  watch: {
    landingVisible(value) {
      // matches the mobile breakpoint for navigation-drawer
      if (!value && this.$vuetify.breakpoint.mdAndUp) {
        this.controlsDrawer = true;
      } else if (value) {
        this.controlsDrawer = false;
      }
    },
  },
  mounted() {
    // listen for proxyManager changes
    this.renderListener = vtkListenerHelper.newInstance(
      () => {
        if (!this.loadingState) {
          this.proxyManager.autoAnimateViews();
        }
      },
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

    // attach keyboard shortcuts
    shortcuts.forEach(({ key, action }) => {
      if (Actions[action]) {
        Mousetrap.bind(key, (e) => {
          e.preventDefault();
          this.$store.dispatch(Actions[action]);
        });
      }
    });

    // listen for errors
    window.addEventListener('error', this.recordError);

    // listen for errors via console.error
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

    shortcuts.forEach(({ key, action }) => {
      if (Actions[action]) {
        Mousetrap.unbind(key);
      }
    });

    this.pxmSub.unsubscribe();
    this.renderListener.removeListeners();
  },
  methods: Object.assign(
    mapMutations({
      showApp: Mutations.SHOW_APP,
      showLanding: Mutations.SHOW_LANDING,
      toggleLanding() {
        if (this.landingVisible) {
          this.showApp();
        } else {
          this.showLanding();
        }
      },
    }),
    mapActions({
      promptUserFiles: Actions.PROMPT_FOR_FILES,

      openSample: (dispatch, urls, names) => {
        // dispatch: delete all loaded files since this is only called
        // by clicking on sample data
        dispatch(Actions.OPEN_REMOTE_FILES, { urls, names }).then(() =>
          dispatch(Actions.RESET_WORKSPACE)
        );
      },

      openFiles: (dispatch, files) =>
        dispatch(Actions.OPEN_FILES, Array.from(files)),

      saveState: Actions.SAVE_STATE,
    }),
    {
      recordError(error) {
        this.errors.push(error);
      },
    }
  ),
};
