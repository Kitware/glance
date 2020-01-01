import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

import RawFileReader from 'paraview-glance/src/components/core/RawFileReader';

// ----------------------------------------------------------------------------

export default {
  name: 'FileLoader',
  components: {
    RawFileReader,
  },
  computed: Object.assign(
    mapState('files', {
      stage: (state) => state.stage,
      files: (state) => state.files,
      loadingNames: (state) =>
        [].concat(state.urls, state.files).map((o) => o.name),
      preloadCanContinue(state) {
        const { files, rawInfos } = state;
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
    mapGetters('files', {
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
          commit('showApp', null, { root: true });
        }
        commit('fileIdle');
      },
    }),
    ...mapActions('files', ['openFiles']),
    isRawFile: (f) => f.name.toLowerCase().endsWith('.raw'),
  },
};
