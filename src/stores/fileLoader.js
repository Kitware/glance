import Vue from 'vue';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import ReaderFactory from 'paraview-glance/src/io/ReaderFactory';
import { Mutations, Actions } from 'paraview-glance/src/stores/types';

// ----------------------------------------------------------------------------

function getSupportedExtensions() {
  return ['raw', 'glance'].concat(ReaderFactory.listSupportedExtensions());
}

// ----------------------------------------------------------------------------

function getExtension(file) {
  const i = file.name.lastIndexOf('.');
  if (i > -1) {
    return file.name.substr(i + 1).toLowerCase();
  }
  return '';
}

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
    urls: [],
    rawInfos: {},
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
    FILE_SET_URLS(state, urls) {
      Vue.set(state, 'urls', urls);
    },
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
      Vue.set(state.rawInfos, fileIndex, rawInfo);
    },
    FILE_CLEAR_RAW_INFO(state) {
      Vue.set(state, 'rawInfos', {});
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
      const exts = getSupportedExtensions();
      ReaderFactory.openFiles(exts, (files) =>
        dispatch(Actions.OPEN_FILES, Array.from(files))
      );
    },
    /**
     *
     * @param {Object[]} fileList list of files to open
     * @param {file} fileList[].file File object
     * @param {name?} fileList[].name full name of file
     * @param {isRaw?} fileList[].extension extension of ifle
     */
    OPEN_FILES({ commit, state, dispatch, rootState }, fileList) {
      commit(Mutations.FILE_SET_FILES, fileList);

      const loadList = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const ext = getExtension(file);
        switch (ext) {
          case 'glance': {
            if (
              loadList.length === 0 ||
              getExtension(loadList[0]) !== 'glance'
            ) {
              loadList.unshift(file);
            }
            break;
          }
          default:
            loadList.push(file);
        }
      }

      const needsPreload =
        loadList.filter((f) => getExtension(f) === 'raw').length !==
        Object.keys(state.rawInfos).length;

      if (needsPreload) {
        commit(Mutations.FILE_CLEAR_RAW_INFO);
        commit(Mutations.FILE_PRELOAD);
      } else if (getExtension(loadList[0]) === 'glance') {
        commit(Mutations.FILE_LOAD);
        // Don't load any other file except for the state file
        dispatch(Actions.LOAD_STATE, loadList[0])
          .then(() => onLoadOkay(commit))
          .catch((error) => onLoadErrored(commit, [error]));
      } else {
        commit(Mutations.FILE_LOAD);
        const promises = loadList.map((file, i) => {
          // Handle raw
          if (getExtension(file) === 'raw') {
            return readRawFile(file, state.rawInfos[i]).then((dataset) => ({
              name: file.name,
              dataset,
            }));
          }

          return ReaderFactory.loadFiles([file]).then((r) => r[0]);
        });

        allWithErrors(promises)
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
    OPEN_REMOTE_FILES({ commit, dispatch }, { urls, names, types = [] }) {
      if (urls && urls.length && names && names.length) {
        const urlsToProcess = urls.map((url, index) => ({
          name: names[index],
          type: types[index],
          url,
        }));

        commit(Mutations.FILE_SET_FILES, urlsToProcess);

        dispatch(Actions.FETCH_REMOTE, urlsToProcess)
          .then((files) => {
            commit(Mutations.FILE_SET_URLS, []);
            return dispatch(Actions.OPEN_FILES, files);
          })
          .catch((errors) => onLoadErrored(commit, errors));
      }
    },
    FETCH_REMOTE({ commit }, remotes) {
      commit(Mutations.FILE_LOAD);

      const progressCb = (index) => (progress) =>
        commit(Mutations.FILE_UPDATE_PROGRESS, {
          index,
          progress: (100 * progress.loaded) / progress.total / remotes.length,
        });

      const promises = [];
      for (let i = 0; i < remotes.length; ++i) {
        promises.push(
          ReaderFactory.downloadDataset(
            remotes[i].name,
            remotes[i].url,
            progressCb(i)
          )
        );
      }

      return allWithErrors(promises);
    },
    LOAD_STATE({ dispatch }, stateFile) {
      return ReaderFactory.loadFiles([stateFile])
        .then((r) => r[0])
        .then(({ reader }) =>
          reader
            .parseAsArrayBuffer()
            .then(() =>
              dispatch(Actions.RESTORE_APP_STATE, reader.getAppState())
            )
        );
    },
  },
};
