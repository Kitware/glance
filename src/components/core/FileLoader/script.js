import { mapState } from 'vuex';

import RawFileReader from 'paraview-glance/src/components/core/RawFileReader';
import mTypes from 'paraview-glance/src/stores/mutation-types';

// ----------------------------------------------------------------------------

export default {
  name: 'FileLoader',
  components: {
    RawFileReader,
  },
  computed: mapState('files', {
    stage: 'stage',
    files: 'files',
    totalProgress() {
      return this.$store.getters['files/totalProgress'];
    },
    preloadCanLoad() {
      return this.$store.getters['files/rawFilesLoadable'];
    },
    indeterminateProgress() {
      return this.$store.getters['files/indeterminateProgress'];
    },
  }),
  methods: {
    setFileRawInfo(fileIndex, rawInfo) {
      this.$store.commit('files/setFileRawInfo', { fileIndex, rawInfo });
    },
    cancel() {
      this.$store.commit('files/idle');
    },
    readFiles() {
      this.$store.dispatch('files/readFiles');
    },
    closeAndTryToLoad() {
      const allFilesErrored = this.files.reduce(
        (flag, { error }) => flag && error,
        true
      );
      if (!allFilesErrored) {
        this.$store.commit(mTypes.SHOW_APP);
      }
      this.$store.commit('files/idle');
    },
  },
};
