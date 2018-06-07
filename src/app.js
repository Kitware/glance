/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import Vuetify from 'vuetify';

// import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';
import vtkProxyManager from 'vtk.js/Sources/Proxy/Core/ProxyManager';

/* eslint-disable-next-line import/extensions */
import 'typeface-roboto';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import 'paraview-glance/src/io/ParaViewGlanceReaders';
import ReaderFactory from 'paraview-glance/src/io/ReaderFactory';
import App from 'paraview-glance/src/components/core/App';
import Config from 'paraview-glance/src/config';

// Expose IO API to Glance global object
export const {
  registerReader,
  listReaders,
  listSupportedExtensions,
  openFiles,
  loadFiles,
  registerReadersToProxyManager,
} = ReaderFactory;

Vue.use(Vuetify);

// setup event bus
Vue.prototype.$eventBus = new Vue();

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

  /* eslint-disable no-new */
  new Vue({
    el: '#root-container',
    components: { App },
    provide: {
      proxyManager,
    },
    template: '<App />',
  });
}
