import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

import RawFileReader from 'paraview-glance/src/components/core/RawFileReader';

// ----------------------------------------------------------------------------

export default {
  name: 'FileLoader',
  components: {
    RawFileReader,
  },
  computed: Object.assign(
    mapState({
      stage: (state) => state.files.stage,
      files: (state) => state.files.files,
      loadingNames: (state) =>
        [].concat(state.files.urls, state.files.files).map((o) => o.name),
      preloadCanContinue(state) {
        const { files, rawInfos } = state.files;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (
            this.isRawFile(file) &&
            (!(i in rawInfos) || rawInfos[i].effectiveSize !== file.size)
          ) {
            return false;
          }
        }
        return true;
      },
    }),
    mapGetters({
      totalProgress: 'fileTotalProgress',
      preloadCanLoad: 'fileRawFilesLoadable',
      indeterminateProgress: 'fileIndeterminateProgress',
    })
  ),
  methods: {
    ...mapMutations({
      setFileRawInfo: (commit, fileIndex, rawInfo) =>
        commit('fileSetRawInfo', { fileIndex, rawInfo }),

      cancel: 'fileIdle',

      closeAndTryToLoad(commit) {
        const allFilesErrored = this.files.reduce(
          (flag, { error }) => flag && error,
          true
        );
        if (!allFilesErrored) {
          commit('showApp');
        }
        commit('fileIdle');
      },
    }),
    ...mapActions(['openFiles']),
    isRawFile: (f) => f.name.toLowerCase().endsWith('.raw'),
  },
};
