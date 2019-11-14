/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify/lib';

import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';
import vtkProxyManager from 'vtk.js/Sources/Proxy/Core/ProxyManager';

/* eslint-disable-next-line import/extensions */
import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.css';
import 'paraview-glance/static/global.css';

import 'paraview-glance/src/io/ParaViewGlanceReaders';
import ReaderFactory from 'paraview-glance/src/io/ReaderFactory';
import App from 'paraview-glance/src/components/core/App';
import Config from 'paraview-glance/src/config';
import createStore, {
  registerProxyManagerHooks,
} from 'paraview-glance/src/store';
import { Actions, Mutations } from 'paraview-glance/src/store/types';

// Expose IO API to Glance global object
export const {
  getReader,
  importBase64Dataset,
  listReaders,
  listSupportedExtensions,
  loadFiles,
  openFiles,
  registerReader,
  registerReadersToProxyManager,
} = ReaderFactory;

Vue.use(Vuex);
Vue.use(Vuetify);

let activeProxyConfig = null;
/**
 * Sets the active proxy configuration to be used by createViewer.
 *
 * Once createViewer() is called, setActiveProxyConfiguration will do nothing.
 * Proxy config precedence (decreasing order):
 *   createViewer param, active proxy config, Generic config
 */
export function setActiveProxyConfiguration(config) {
  activeProxyConfig = config;
}

export function createViewer(container, proxyConfig = null) {
  const proxyConfiguration = proxyConfig || activeProxyConfig || Config.Proxy;
  const proxyManager = vtkProxyManager.newInstance({ proxyConfiguration });

  const store = createStore(proxyManager);

  // subscription won't be unsubscribed b/c we currently
  // don't have a way to destroy a viewer
  registerProxyManagerHooks(proxyManager, store);

  /* eslint-disable no-new */
  new Vue({
    el: container,
    components: { App },
    store,
    vuetify: new Vuetify(),
    template: '<App />',
  });

  // support history-based navigation
  function onRoute(event) {
    const state = event.state || {};
    if (state.app) {
      store.commit(Mutations.SHOW_APP);
    } else {
      store.commit(Mutations.SHOW_LANDING);
    }
  }
  store.watch(
    (state) => state.route,
    (route) => {
      const state = window.history.state || {};
      if (route === 'landing' && state.app) {
        window.history.back();
      }
      if (route === 'app' && !state.app) {
        window.history.pushState({ app: true }, '');
      }
    }
  );
  window.history.replaceState({ app: false }, '');
  window.addEventListener('popstate', onRoute);

  return {
    processURLArgs() {
      const { name, url, type } = vtkURLExtract.extractURLParameters();
      if (name && url) {
        const names = typeof name === 'string' ? [name] : name;
        const urls = typeof url === 'string' ? [url] : url;
        const types = typeof type === 'string' ? [type] : type || [];
        store.dispatch(Actions.OPEN_REMOTE_FILES, { urls, names, types });
      }
    },
    // All components must have a unique name
    addDatasetPanel(component) {
      store.commit(Mutations.ADD_PANEL, { component });
    },
    proxyManager,
    showApp() {
      store.commit(Mutations.SHOW_APP);
    },
  };
}
