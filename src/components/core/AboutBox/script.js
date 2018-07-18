import SvgIcon from 'paraview-glance/src/components/widgets/SvgIcon';

// ----------------------------------------------------------------------------

export default {
  name: 'AboutBox',
  components: {
    SvgIcon,
  },
  data() {
    return {
      version: window.GLANCE_VERSION || 'not available',
    };
  },
};
