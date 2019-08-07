import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

import RawFileReader from 'paraview-glance/src/components/core/RawFileReader';
import { Actions, Getters, Mutations } from 'paraview-glance/src/store/types';

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
      totalProgress: Getters.FILE_TOTAL_PROGRESS,
      preloadCanLoad: Getters.FILE_RAW_FILES_LOADABLE,
      indeterminateProgress: Getters.FILE_INDETERMINATE_PROGRESS,
    })
  ),
  methods: Object.assign(
    mapMutations({
      setFileRawInfo: (commit, fileIndex, rawInfo) =>
        commit(Mutations.FILE_SET_RAW_INFO, { fileIndex, rawInfo }),

      cancel: Mutations.FILE_IDLE,

      closeAndTryToLoad(commit) {
        const allFilesErrored = this.files.reduce(
          (flag, { error }) => flag && error,
          true
        );
        if (!allFilesErrored) {
          commit(Mutations.SHOW_APP);
        }
        commit(Mutations.FILE_IDLE);
      },
    }),
    mapActions({
      openFiles: Actions.OPEN_FILES,
    }),
    {
      isRawFile: (f) => f.name.toLowerCase().endsWith('.raw'),
    }
  ),
};
