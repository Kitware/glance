/* eslint-disable import/prefer-default-export */

import Vue from 'vue';
import vtkProxyManager from 'vtk.js/Sources/Proxy/Core/ProxyManager';

import App from './App';
import Config from './config';

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
    data: {
      proxyManager,
    },
    template: '<App />',
  });
}
