import Vue from 'vue';
import JSZip from 'jszip';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import ReaderFactory from 'paraview-glance/src/io/ReaderFactory';
import mTypes from 'paraview-glance/src/stores/mutation-types';

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

function loadState(file) {
  return new Promise((resolve) => {
    const zip = new JSZip();
    zip.loadAsync(file).then(() => {
      zip.forEach((relativePath, zipEntry) => {
        if (relativePath.match(/state\.json$/i)) {
          zipEntry.async('string').then((txt) => {
            resolve(JSON.parse(txt));
          });
        }
      });
    });
  });
}

// ----------------------------------------------------------------------------

export default {
  namespaced: true,

  state: {
    stage: 'idle',
    files: [],
    progresses: [],
  },

  getters: {
    totalProgress(state) {
      return state.progresses.reduce((sum, v) => sum + (v || 0), 0);
    },
    rawFilesLoadable(state) {
      return state.files
        .filter((file) => file.isRaw)
        .reduce(
          (flag, { file, rawInfo }) =>
            rawInfo && file.size === rawInfo.effectiveSize && flag,
          true
        );
    },
    indeterminateProgress(state) {
      return state.files.reduce(
        (flag, { type }) => type === 'file' || flag,
        false
      );
    },
  },

  mutations: {
    files(state, files) {
      Vue.set(state, 'files', files);
    },
    preload(state) {
      state.stage = 'preload';
    },
    load(state) {
      state.stage = 'load';
      state.progresses = Array(state.files.length).fill(0);
    },
    error(state) {
      state.stage = 'error';
    },
    idle(state) {
      state.stage = 'idle';
      state.files = [];
    },
    setFileRawInfo(state, { fileIndex, rawInfo }) {
      state.files[fileIndex].rawInfo = rawInfo;
    },
    setFileError(state, { fileIndex, error }) {
      Vue.set(state.files[fileIndex], 'error', error);
    },
    updateProgress(state, { index, progress }) {
      Vue.set(state.progresses, index, progress);
    },
  },

  actions: {
    promptForFiles({ dispatch }) {
      const exts = ['raw', 'glance'].concat(
        ReaderFactory.listSupportedExtensions()
      );
      ReaderFactory.openFiles(exts, (files) => dispatch('openFiles', files));
    },
    openFiles({ commit, dispatch }, fileList) {
      const files = Array.from(fileList).map((file) => ({
        type: 'file',
        name: file.name,
        file,
        extension: file.name.split('.').pop(),
        isRaw: file.name.endsWith('.raw'),
        rawInfo: null,
      }));

      commit('files', files);

      let preload = false;
      for (let i = 0; i < files.length; ++i) {
        if (files[i].isRaw) {
          preload = true;
          break;
        }
      }

      if (preload) {
        commit('preload');
      } else {
        dispatch('readFiles');
      }
    },
    readFiles({ state, commit, dispatch, rootState }) {
      commit('load');

      const promises = state.files.map((file) => {
        // Handle raw
        if (file.rawInfo) {
          return readRawFile(file.file, file.rawInfo).then((dataset) =>
            ReaderFactory.registerReadersToProxyManager(
              [
                {
                  name: file.name,
                  dataset,
                },
              ],
              rootState.proxyManager
            )
          );
        }

        // Handle state file
        if (file.extension === 'glance') {
          return loadState(file.file).then((appState) =>
            rootState.proxyManager.loadState(appState)
          );
        }

        return ReaderFactory.loadFiles([file.file]).then((readers) =>
          ReaderFactory.registerReadersToProxyManager(
            readers,
            rootState.proxyManager
          )
        );
      });

      dispatch('handleLoadResults', promises);
    },
    openRemoteFiles(
      { commit, dispatch, rootState },
      { urls, names, types = [] }
    ) {
      if (urls && urls.length && names && names.length) {
        const files = urls.map((url, index) => ({
          type: 'url',
          name: names[index],
          url,
        }));

        commit('files', files);
        commit('load');

        const progressCb = (index) => (progress) =>
          commit('updateProgress', {
            index,
            progress: (100 * progress.loaded) / progress.total / urls.length,
          });

        const promises = [];
        for (let i = 0; i < urls.length; ++i) {
          promises.push(
            ReaderFactory.downloadDataset(
              names[i],
              urls[i],
              progressCb(i)
            ).then(({ reader, sourceType }) =>
              ReaderFactory.registerReadersToProxyManager(
                [
                  {
                    reader,
                    name: names[i],
                    sourceType: types[i] || sourceType,
                  },
                ],
                rootState.proxyManager
              )
            )
          );
        }

        dispatch('handleLoadResults', promises);
      }
    },
    handleLoadResults({ commit }, promises) {
      allWithErrors(promises)
        .then(() => {
          commit('idle');
          commit(mTypes.SHOW_APP, null, { root: true });
        })
        .catch((errors) => {
          for (let i = 0; i < errors.length; ++i) {
            if (errors[i]) {
              commit('setFileError', { fileIndex: i, error: errors[i] });
            }
          }
          commit('error');
        });
    },
  },
};
