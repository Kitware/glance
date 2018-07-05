import Vuex from 'vuex';
import vtkProxyManager from 'vtk.js/Sources/Proxy/Core/ProxyManager';

import Config from 'paraview-glance/src/config';
import global from 'paraview-glance/src/stores/globalSettings';
import files from 'paraview-glance/src/stores/fileLoader';
import mTypes from 'paraview-glance/src/stores/mutation-types';

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
    },
    modules: {
      global,
      files,
    },
    mutations: {
      [mTypes.SHOW_LANDING](state) {
        state.route = 'landing';
      },
      [mTypes.SHOW_APP](state) {
        state.route = 'app';
      },
    },
  });
}

export default createStore;
