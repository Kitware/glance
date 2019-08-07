import JSZip from 'jszip';
import Vue from 'vue';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import ReaderFactory from 'paraview-glance/src/io/ReaderFactory';
import { Mutations, Actions } from 'paraview-glance/src/store/types';

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

      const stateFile = fileList.find((f) => getExtension(f.name) === 'glance');
      if (stateFile) {
        commit(Mutations.FILE_LOAD);
        // Don't load any other file except for the state file
        return dispatch(Actions.LOAD_STATE, stateFile)
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
        return Promise.all(p).then(() =>
          dispatch(Actions.OPEN_FILES, newFileList)
        );
      }

      const needsPreload =
        fileList.filter((f) => getExtension(f.name) === 'raw').length !==
        Object.keys(state.rawInfos).length;

      if (needsPreload) {
        commit(Mutations.FILE_PRELOAD);
        return Promise.resolve();
      }
      commit(Mutations.FILE_LOAD);

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
          commit(Mutations.FILE_CLEAR_RAW_INFO);
          // load all successful readers
          if (readers.length) {
            ReaderFactory.registerReadersToProxyManager(
              readers,
              rootState.proxyManager
            );
          }
        });
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
