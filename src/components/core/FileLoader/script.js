import { mapGetters, mapState, mapActions } from 'vuex';

import RawFileReader from 'paraview-glance/src/components/core/RawFileReader';

// ----------------------------------------------------------------------------

export default {
  name: 'FileLoader',
  components: {
    RawFileReader,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('files', {
      // show file list with recent on top
      fileList: (state) => Array.from(state.fileList).reverse(),
      pendingFiles: (state) =>
        state.fileList.reduce(
          (flag, file) => flag || Boolean(file.state === 'loading'),
          false
        ),
      loading: (state) => state.loading,
    }),
    ...mapGetters('files', ['anyErrors']),
  },
  methods: {
    ...mapActions('files', [
      'openFiles',
      'promptLocal',
      'deleteFile',
      'load',
      'resetQueue',
    ]),
    ...mapActions('files', {
      SetRawFileInfo: (dispatch, index, info) =>
        dispatch('setRawFileInfo', { index, info }),
    }),
    loadFiles() {
      this.load().finally(() => {
        this.close();
        this.$emit('load');
      });
    },
    close() {
      this.$emit('input', false);
      // hack to reset queue only after the file dialog closes
      setTimeout(() => this.resetQueue(), 10);
    },
  },
};
