import JSZip from 'jszip';
import Vuex from 'vuex';
import vtkProxyManager from 'vtk.js/Sources/Proxy/Core/ProxyManager';

import Config from 'paraview-glance/src/config';
import global from 'paraview-glance/src/stores/globalSettings';
import files from 'paraview-glance/src/stores/fileLoader';
import screenshots from 'paraview-glance/src/stores/screenshots';
import views from 'paraview-glance/src/stores/views';
import { Mutations } from 'paraview-glance/src/stores/types';

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
    },
    actions: {
      SAVE_STATE({ commit, state }, fileNameToUse) {
        const t = new Date();
        const fileName =
          fileNameToUse ||
          `${t.getFullYear()}${t.getMonth() +
            1}${t.getDate()}_${t.getHours()}-${t.getMinutes()}-${t.getSeconds()}.glance`;

        commit(Mutations.SAVING_STATE, fileName);

        const userData = { layout: 'Something...', settings: { bg: 'white' } };
        const options = { recycleViews: true };
        const zip = new JSZip();
        zip.file(
          'state.json',
          JSON.stringify(
            state.proxyManager.saveState(options, userData),
            null,
            2
          )
        );
        console.log('zip entry added, start compression...');
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
      },
    },
  });
}

export default createStore;
