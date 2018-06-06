/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import Vuetify from 'vuetify';
import vtkProxyManager from 'vtk.js/Sources/Proxy/Core/ProxyManager';

import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import App from 'paraview-glance/src/App';
import Config from 'paraview-glance/src/config';

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
