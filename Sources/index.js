/* eslint-disable import/prefer-default-export */
/* eslint-disable react/no-render-return-value */
import 'babel-polyfill';
import '@fortawesome/fontawesome-free-webfonts/css/fontawesome.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css';
import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';
import vtkProxyManager from 'vtk.js/Sources/Proxy/Core/ProxyManager';

import ReactDOM from 'react-dom';
import React from 'react';

import './io/ParaViewGlanceReaders';
import './properties';

import Configs from './config';
import MainView from './MainView';
import * as Controls from './controls';
import ReaderFactory from './io/ReaderFactory';

export const {
  registerReader,
  listReaders,
  listSupportedExtensions,
  openFiles,
  loadFiles,
  registerReadersToProxyManager,
} = ReaderFactory;
export const { registerControlTab, unregisterControlTab } = Controls;

export function createViewer(container, proxyConfig = null) {
  const { mode } = vtkURLExtract.extractURLParameters();
  const proxyConfiguration = proxyConfig || Configs[mode] || Configs.Generic;

  const proxyManager = vtkProxyManager.newInstance({ proxyConfiguration });
  const mainView = ReactDOM.render(
    <MainView proxyManager={proxyManager} />,
    container
  );

  function addDataSet(name, dataset, sourceType) {
    registerReadersToProxyManager(
      [{ reader: null, name, sourceType, dataset }],
      proxyManager
    );
  }

  function progressCallback(event) {
    const progressPercent = Math.round(100 * event.loaded / event.total);
    mainView.setState({ progressPercent });
  }

  function openRemoteDataset(name, url, type) {
    mainView.setState({ showProgress: true });
    ReaderFactory.downloadDataset(name, url, progressCallback)
      .then(({ reader, sourceType }) => {
        registerReadersToProxyManager(
          [{ reader, name, sourceType: type || sourceType }],
          proxyManager
        );
        mainView.setState({ showProgress: false });
      })
      .catch(console.error);
  }

  function loadAndViewFiles(files) {
    return ReaderFactory.loadFiles(files).then((readers) =>
      registerReadersToProxyManager(readers, proxyManager)
    );
  }

  function toggleControl() {
    mainView.onToggleControl();
  }

  function updateTab(tabName = 'pipeline') {
    mainView.controls.changeTabTo(tabName);
  }

  function processURLArgs() {
    const {
      name,
      url,
      type,
      collapse,
      tab,
    } = vtkURLExtract.extractURLParameters();
    if (name && url) {
      openRemoteDataset(name, url, type);
      updateTab(tab);
    }
    if (collapse) {
      toggleControl();
    }
  }

  function unbind() {
    ReactDOM.unmountComponentAtNode(container);
  }

  return {
    addDataSet,
    openRemoteDataset,
    loadAndViewFiles,
    processURLArgs,
    unbind,
    toggleControl,
    updateTab,
  };
}
