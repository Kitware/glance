import { mapState } from 'vuex';

// ----------------------------------------------------------------------------

export default {
  name: 'StateFileGenerator',
  computed: mapState({
    proxyManager: 'proxyManager',
    fileGenerationInProgress: (state) => !!state.savingStateName,
    fileName: 'savingStateName',
  }),
};
