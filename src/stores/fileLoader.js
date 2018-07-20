import Vue from 'vue';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import ReaderFactory from 'paraview-glance/src/io/ReaderFactory';
import { Mutations, Actions } from 'paraview-glance/src/stores/types';

// ----------------------------------------------------------------------------

function allWithErrors(promises) {
  return new Promise((resolve, reject) => {
    let okayCount = 0;
    const errors = Array(promises.length);
    Promise.all(
      promises.map((promise, index) =>
        promise
          .then((result) => {
            okayCount += 1;
            return result;
          })
          .catch((error) => {
            errors[index] = error;
          })
      )
    ).then((results) => {
      if (okayCount === promises.length) {
        resolve(results);
      } else {
        reject(errors);
      }
    });
  });
}

// ----------------------------------------------------------------------------

function readRawFile(file, { dimensions, spacing, dataType }) {
  return new Promise((resolve, reject) => {
    const fio = new FileReader();
    fio.onload = function onFileReaderLoad() {
      const dataset = vtkImageData.newInstance({
        spacing,
        extent: [
          0,
          dimensions[0] - 1,
          0,
          dimensions[1] - 1,
          0,
          dimensions[2] - 1,
        ],
      });
      const scalars = vtkDataArray.newInstance({
        name: 'Scalars',
        values: new dataType.constructor(fio.result),
      });
      dataset.getPointData().setScalars(scalars);

      resolve(dataset);
    };

    fio.onerror = (error) => reject(error);

    fio.readAsArrayBuffer(file);
  });
}

// ----------------------------------------------------------------------------

function onLoadOkay(commit) {
  commit(Mutations.FILE_IDLE);
  commit(Mutations.SHOW_APP);
}

// ----------------------------------------------------------------------------

function onLoadErrored(commit, errors) {
  for (let i = 0; i < errors.length; ++i) {
    if (errors[i]) {
      commit(Mutations.FILE_SET_ERROR, {
        fileIndex: i,
        error: errors[i],
      });
    }
  }
  commit(Mutations.FILE_ERROR);
}

// ----------------------------------------------------------------------------

export default {
  state: {
    stage: 'idle',
    files: [],
    progresses: [],
  },

  getters: {
    FILE_TOTAL_PROGRESS(state) {
      return state.progresses.reduce((sum, v) => sum + (v || 0), 0);
    },
    FILE_RAW_FILES_LOADABLE(state) {
      return state.files
        .filter((file) => file.isRaw)
        .reduce(
          (flag, { file, rawInfo }) =>
            rawInfo && file.size === rawInfo.effectiveSize && flag,
          true
        );
    },
    FILE_INDETERMINATE_PROGRESS(state) {
      return state.files.reduce(
        (flag, { type }) => type === 'file' || flag,
        false
      );
    },
  },

  mutations: {
    FILE_SET_FILES(state, files) {
      Vue.set(state, 'files', files);
    },
    FILE_PRELOAD(state) {
      state.stage = 'preload';
    },
    FILE_LOAD(state) {
      state.stage = 'load';
      state.progresses = Array(state.files.length).fill(0);
    },
    FILE_ERROR(state) {
      state.stage = 'error';
    },
    FILE_IDLE(state) {
      state.stage = 'idle';
      state.files = [];
    },
    FILE_SET_RAW_INFO(state, { fileIndex, rawInfo }) {
      state.files[fileIndex].rawInfo = rawInfo;
    },
    FILE_SET_ERROR(state, { fileIndex, error }) {
      Vue.set(state.files[fileIndex], 'error', error);
    },
    FILE_UPDATE_PROGRESS(state, { index, progress }) {
      Vue.set(state.progresses, index, progress);
    },
  },

  actions: {
    PROMPT_FOR_FILES({ dispatch }) {
      const exts = ['raw', 'glance'].concat(
        ReaderFactory.listSupportedExtensions()
      );
      ReaderFactory.openFiles(exts, (files) =>
        dispatch(
          Actions.OPEN_FILES,
          Array.from(files).map((file) => ({ file }))
        )
      );
    },
    /**
     *
     * @param {Object[]} fileList list of files to open
     * @param {file} fileList[].file File object
     * @param {name?} fileList[].name full name of file
     * @param {isRaw?} fileList[].extension extension of ifle
     */
    OPEN_FILES({ commit, dispatch, rootState }, fileList) {
      const files = Array.from(fileList)
        .map((fileSpec) => ({
          type: 'file',
          name: fileSpec.name || fileSpec.file.name,
          file: fileSpec.file,
          rawInfo: fileSpec.rawInfo,
        }))
        .map((fileSpec) =>
          Object.assign(fileSpec, {
            extension: fileSpec.name.split('.').pop(),
            isRaw: fileSpec.name.endsWith('.raw'),
          })
        );

      commit(Mutations.FILE_SET_FILES, files);

      let preload = false;
      for (let i = 0; i < files.length; ++i) {
        if (files[i].isRaw && !files[i].rawInfo) {
          preload = true;
          break;
        }
      }

      if (preload) {
        commit(Mutations.FILE_PRELOAD);
      } else {
        dispatch(Actions.READ_FILES, files)
          // load state files, if any
          .then((readers) => dispatch(Actions.LOAD_STATE, readers))
          .then((readers) =>
            ReaderFactory.registerReadersToProxyManager(
              readers,
              rootState.proxyManager
            )
          )
          .then(() => onLoadOkay(commit))
          .catch((errors) => onLoadErrored(commit, errors));
      }
    },
    OPEN_REMOTE_FILES(
      { commit, dispatch, rootState },
      { urls, names, types = [] }
    ) {
      if (urls && urls.length && names && names.length) {
        const files = urls.map((url, index) => ({
          type: 'url',
          name: names[index],
          url,
        }));

        commit(Mutations.FILE_SET_FILES, files);
        dispatch(Actions.READ_REMOTE_FILES, { urls, names })
          // load state files, if any
          .then((readers) => dispatch(Actions.LOAD_STATE, readers))
          .then((readers) =>
            ReaderFactory.registerReadersToProxyManager(
              readers.map(({ reader, sourceType }, i) => ({
                reader,
                name: names[i],
                sourceType: types[i] || sourceType,
                metadata: { url: urls[i] },
              })),
              rootState.proxyManager
            )
          )
          .then(() => onLoadOkay(commit))
          .catch((errors) => onLoadErrored(commit, errors));
      }
    },
    READ_REMOTE_FILES({ commit }, { urls, names }) {
      if (urls && urls.length && names && names.length) {
        commit(Mutations.FILE_LOAD);

        const progressCb = (index) => (progress) =>
          commit(Mutations.FILE_UPDATE_PROGRESS, {
            index,
            progress: (100 * progress.loaded) / progress.total / urls.length,
          });

        const promises = [];
        for (let i = 0; i < urls.length; ++i) {
          promises.push(
            ReaderFactory.downloadDataset(names[i], urls[i], progressCb(i))
          );
        }

        return allWithErrors(promises);
      }
      return Promise.reject();
    },
    /**
     *
     * @param {Object[]} files list of files to open
     * @param {file} files[].file File object
     * @param {name} files[].name full name of file
     * @param {rawInfo} files[].extension extension of ifle
     */
    READ_FILES({ commit }, files) {
      commit(Mutations.FILE_LOAD);

      const promises = files.map((file) => {
        // Handle raw
        if (file.rawInfo) {
          return readRawFile(file.file, file.rawInfo).then((dataset) => ({
            name: file.name,
            dataset,
          }));
        }

        return ReaderFactory.loadFiles([file.file]).then(
          // only return single reader
          (readers) => readers[0]
        );
      });

      return allWithErrors(promises);
    },
    LOAD_STATE({ dispatch }, readers) {
      // technically should only be loading a single state file
      let stateReader;
      const otherReaders = [];
      readers.forEach((r) => {
        if (r.reader && r.reader.isA && r.reader.isA('vtkGlanceStateReader')) {
          stateReader = r.reader;
        } else {
          otherReaders.push(r);
        }
      });

      if (stateReader) {
        return allWithErrors([
          stateReader
            .parseAsArrayBuffer()
            .then(() =>
              dispatch(Actions.RESTORE_APP_STATE, stateReader.getAppState())
            )
            .then(() => otherReaders),
        ]);
      }
      return Promise.resolve(otherReaders);
    },
  },
};
