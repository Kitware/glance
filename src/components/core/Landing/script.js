import samples from 'paraview-glance/src/samples';
import DragAndDrop from 'paraview-glance/src/components/widgets/DragAndDrop';
import { Authentication as GirderAuthentication } from '@girder/components/src/components';
import { Breakpoints } from 'paraview-glance/src/constants';
import { DataBrowser as GirderDataBrowser } from '@girder/components/src/components';
export default {
  name: 'Landing',
  components: {
    DragAndDrop,
    GirderAuthentication,
    GirderDataBrowser,
  },
  data() {
    return {
      samples,
      version: window.GLANCE_VERSION || 'no version available',
    };
  },
  inject: ['girderRest'],
  computed: {
    smallScreen() {
      return this.$vuetify.breakpoint.width < Breakpoints.md;
    },
    currentUserLogin() {
      return this.girderRest.user ? this.girderRest.user.login : 'anonymous';
    },
    loggedOut() {
      return this.girderRest.user === null;
    },
  },
  methods: {
    openSample(sample) {
      const urls = [];
      const names = [];
      for (let i = 0; i < sample.datasets.length; ++i) {
        urls.push(sample.datasets[i].url);
        names.push(sample.datasets[i].name);
      }
      this.$emit('open-urls', urls, names);
    },
  },
};
