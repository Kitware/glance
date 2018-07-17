import JSZip from 'jszip';
import merge from 'merge';
import Vue from 'vue';
import Vuex from 'vuex';

import vtk from 'vtk.js/Sources/vtk';
import vtkProxyManager from 'vtk.js/Sources/Proxy/Core/ProxyManager';

import ReaderFactory from 'paraview-glance/src/io/ReaderFactory';
import Config from 'paraview-glance/src/config';
import global from 'paraview-glance/src/stores/globalSettings';
import files from 'paraview-glance/src/stores/fileLoader';
import screenshots from 'paraview-glance/src/stores/screenshots';
import views from 'paraview-glance/src/stores/views';
import { Actions, Mutations } from 'paraview-glance/src/stores/types';

// Reduces app state to relevant persistent state
function reduceState(state) {
  return {
    route: state.route,
    global: state.global,
    views: state.views,
  };
}

function createStore(proxyManager = null) {
  let pxm = proxyManager;
  if (!proxyManager) {
    pxm = vtkProxyManager.newInstance({
      proxyConfiguration: Config.Proxy,
    });
  }

  return new Vuex.Store({
    state: {
      proxyManager: pxm,
      route: 'landing', // valid values: landing, app
      savingStateName: null,
      panels: {},
    },
    modules: {
      global,
      files,
      screenshots,
      views,
    },
    mutations: {
      SHOW_LANDING(state) {
        state.route = 'landing';
      },
      SHOW_APP(state) {
        state.route = 'app';
      },
      SAVING_STATE(state, name = null) {
        state.savingStateName = name;
      },
      ADD_PANEL: (state, { component, priority = 0 }) => {
        if (!(priority in state.panels)) {
          Vue.set(state.panels, priority, []);
        }
        state.panels[priority].push(component);
      },
    },
    actions: {
      SAVE_STATE({ commit, state }, fileNameToUse) {
        const t = new Date();
        const fileName =
          fileNameToUse ||
          `${t.getFullYear()}${t.getMonth() +
            1}${t.getDate()}_${t.getHours()}-${t.getMinutes()}-${t.getSeconds()}.glance`;

        commit(Mutations.SAVING_STATE, fileName);

        const userData = reduceState(state);
        const options = {
          recycleViews: true,
          datasetHandler(dataset, source) {
            const sourceMeta = source.get('name', 'url', 'remoteMetaData');
            const datasetMeta = dataset.get('name', 'url', 'remoteMetaData');
            const metadata = sourceMeta.url ? sourceMeta : datasetMeta;
            if (metadata.name && metadata.url) {
              return metadata;
            }
            // Not a remote dataset so use basic dataset serialization
            return dataset.getState();
          },
        };

        const zip = new JSZip();
        state.proxyManager.saveState(options, userData).then((stateObject) => {
          zip.file('state.json', JSON.stringify(stateObject));
          zip
            .generateAsync({
              type: 'blob',
              compression: 'DEFLATE',
              compressionOptions: {
                level: 6,
              },
            })
            .then((blob) => {
              console.log('file generated', this.fileName, blob.size);
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement('a');
              anchor.setAttribute('href', url);
              anchor.setAttribute('download', fileName);
              anchor.click();
              setTimeout(() => URL.revokeObjectURL(url), 60000);
              commit(Mutations.SAVING_STATE, null);
            });
        });
      },
      RESTORE_APP_STATE({ dispatch, state }, appState) {
        dispatch(Actions.RESET_WORKSPACE);
        state.proxyManager
          .loadState(appState, {
            datasetHandler(ds) {
              if (ds.vtkClass) {
                return vtk(ds);
              }
              return new Promise((resolve, reject) => {
                ReaderFactory.downloadDataset(ds.name, ds.url).then(
                  ({ dataset, reader }) => {
                    if (reader) {
                      const newDS = reader.getOutputData();
                      newDS.set(ds, true); // Attach remote data origin
                      resolve(newDS);
                    } else if (dataset && dataset.isA) {
                      dataset.set(ds, true); // Attach remote data origin
                      resolve(dataset);
                    } else {
                      reject(new Error('Invalid dataset'));
                    }
                  }
                );
              });
            },
          })
          .then((userData) => {
            this.replaceState(merge.recursive(state, userData));
          });
      },
      RESET_WORKSPACE({ state }) {
        // use setTimeout to avoid some weird crashing with extractDomains
        state.proxyManager
          .getSources()
          .forEach((source) =>
            setTimeout(() => state.proxyManager.deleteProxy(source), 0)
          );
        setTimeout(() => {
          state.proxyManager.renderAllViews();
          state.proxyManager.resetCameraInAllViews();
        }, 0);
      },
    },
  });
}

export default createStore;
