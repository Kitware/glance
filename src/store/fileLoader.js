import JSZip from 'jszip';
import Vue from 'vue';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import ReaderFactory from 'paraview-glance/src/io/ReaderFactory';

// ----------------------------------------------------------------------------

function getSupportedExtensions() {
  return ['zip', 'raw', 'glance'].concat(
    ReaderFactory.listSupportedExtensions()
  );
}

// ----------------------------------------------------------------------------

function getExtension(filename) {
  const i = filename.lastIndexOf('.');
  if (i > -1) {
    return filename.substr(i + 1).toLowerCase();
  }
  return '';
}

// ----------------------------------------------------------------------------

function zipGetSupportedFiles(zip, path) {
  const supportedExts = getSupportedExtensions();
  const promises = [];
  zip.folder(path).forEach((relPath, file) => {
    if (file.dir) {
      promises.push(zipGetSupportedFiles(zip, relPath));
    } else if (supportedExts.indexOf(getExtension(file.name)) > -1) {
      const splitPath = file.name.split('/');
      const baseName = splitPath[splitPath.length - 1];
      promises.push(
        zip
          .file(file.name)
          .async('blob')
          .then((blob) => new File([blob], baseName))
      );
    }
  });
  return promises;
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
  commit('fileIdle');
  commit('showApp', null, { root: true });
}

// ----------------------------------------------------------------------------

function onLoadErrored(commit, errors) {
  for (let i = 0; i < errors.length; ++i) {
    if (errors[i]) {
      commit('fileSetError', {
        fileIndex: i,
        error: errors[i],
      });
    }
  }
  commit('fileError');
}

// ----------------------------------------------------------------------------

export default {
  namespaced: true,
  state: {
    stage: 'idle',
    files: [],
    urls: [],
    rawInfos: {},
    progresses: [],
  },

  getters: {
    fileTotalProgress(state) {
      return state.progresses.reduce((sum, v) => sum + (v || 0), 0);
    },
    fileRawFilesLoadable(state) {
      return state.files
        .filter((file) => file.isRaw)
        .reduce(
          (flag, { file, rawInfo }) =>
            rawInfo && file.size === rawInfo.effectiveSize && flag,
          true
        );
    },
    fileIndeterminateProgress(state) {
      return state.files.reduce(
        (flag, { type }) => type === 'file' || flag,
        false
      );
    },
  },

  mutations: {
    fileSetUrls(state, urls) {
      Vue.set(state, 'urls', urls);
    },
    fileSetFiles(state, files) {
      Vue.set(state, 'files', files);
    },
    filePreload(state) {
      state.stage = 'preload';
    },
    fileLoad(state) {
      state.stage = 'load';
      state.progresses = Array(state.files.length).fill(0);
    },
    fileError(state) {
      state.stage = 'error';
    },
    fileIdle(state) {
      state.stage = 'idle';
      state.files = [];
    },
    fileSetRawInfo(state, { fileIndex, rawInfo }) {
      Vue.set(state.rawInfos, fileIndex, rawInfo);
    },
    fileClearRawInfo(state) {
      Vue.set(state, 'rawInfos', {});
    },
    fileSetError(state, { fileIndex, error }) {
      Vue.set(state.files[fileIndex], 'error', error);
    },
    fileUpdateProgress(state, { index, progress }) {
      Vue.set(state.progresses, index, progress);
    },
  },

  actions: {
    promptForFiles({ dispatch }) {
      const exts = getSupportedExtensions();
      ReaderFactory.openFiles(exts, (files) =>
        dispatch('openFiles', Array.from(files))
      );
    },
    /**
     *
     * @param {Object[]} fileList list of files to open
     * @param {file} fileList[].file File object
     * @param {name?} fileList[].name full name of file
     * @param {isRaw?} fileList[].extension extension of ifle
     */
    openFiles({ commit, state, dispatch, rootState }, fileList) {
      commit('fileSetFiles', fileList);

      const stateFile = fileList.find((f) => getExtension(f.name) === 'glance');
      if (stateFile) {
        commit('fileLoad');
        // Don't load any other file except for the state file
        return dispatch('loadState', stateFile)
          .then(() => onLoadOkay(commit))
          .catch((error) => onLoadErrored(commit, [error]));
      }

      const zips = fileList.filter((f) => getExtension(f.name) === 'zip');
      if (zips.length) {
        const newFileList = fileList.filter(
          (f) => getExtension(f.name) !== 'zip'
        );
        const p = zips.map((file) =>
          JSZip.loadAsync(file)
            .then((zip) => Promise.all(zipGetSupportedFiles(zip)))
            .then((files) => newFileList.push(...files))
        );
        return Promise.all(p).then(() => dispatch('openFiles', newFileList));
      }

      const needsPreload =
        fileList.filter((f) => getExtension(f.name) === 'raw').length !==
        Object.keys(state.rawInfos).length;

      if (needsPreload) {
        commit('filePreload');
        return Promise.resolve();
      }
      commit('fileLoad');

      // split out dicom and single datasets
      const singleFileList = [];
      const dicomFileList = [];
      fileList.forEach((f) => {
        if (getExtension(f.name) === 'dcm') {
          dicomFileList.push(f);
        } else {
          singleFileList.push(f);
        }
      });

      const readers = [];
      const promises = [].concat(
        singleFileList.map((file, i) => {
          // Handle raw
          if (getExtension(file.name) === 'raw') {
            return readRawFile(file, state.rawInfos[i]).then((dataset) =>
              readers.push({
                name: file.name,
                dataset,
              })
            );
          }

          return ReaderFactory.loadFiles([file]).then((rs) =>
            readers.push(...rs)
          );
        }),
        ReaderFactory.loadFileSeries(
          dicomFileList,
          'dcm',
          // use first file as output image name
          dicomFileList.length && dicomFileList[0].name
        ).then((r) => {
          if (r) {
            readers.push(r);
          }
        })
      );

      return allWithErrors(promises)
        .then(() => onLoadOkay(commit))
        .catch((errors) => onLoadErrored(commit, errors))
        .finally(() => {
          // clear leftover raw info
          commit('fileClearRawInfo');
          // load all successful readers
          if (readers.length) {
            ReaderFactory.registerReadersToProxyManager(
              readers,
              rootState.proxyManager
            );
          }
        });
    },
    openRemoteFiles({ commit, dispatch }, { urls, names, types = [] }) {
      if (urls && urls.length && names && names.length) {
        const urlsToProcess = urls.map((url, index) => ({
          name: names[index],
          type: types[index],
          url,
        }));

        commit('fileSetFiles', urlsToProcess);

        dispatch('fetchRemote', urlsToProcess)
          .then((files) => {
            commit('fileSetUrls', []);
            return dispatch('openFiles', files);
          })
          .catch((errors) => onLoadErrored(commit, errors));
      }
    },
    fetchRemote({ commit }, remotes) {
      commit('fileLoad');

      const progressCb = (index) => (progress) =>
        commit('fileUpdateProgress', {
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
    loadState({ dispatch }, stateFile) {
      return ReaderFactory.loadFiles([stateFile])
        .then((r) => r[0])
        .then(({ reader }) =>
          reader
            .parseAsArrayBuffer()
            .then(() =>
              dispatch('restoreAppState', reader.getAppState(), { root: true })
            )
        );
    },
  },
};
