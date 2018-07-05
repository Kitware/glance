import Vuex from 'vuex';
import vtkProxyManager from 'vtk.js/Sources/Proxy/Core/ProxyManager';

import Config from 'paraview-glance/src/config';
import global from 'paraview-glance/src/stores/globalSettings';

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
    },
    modules: {
      global,
    },
  });
}

export default createStore;
