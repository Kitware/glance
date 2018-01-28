/* eslint-disable import/prefer-default-export */
/* eslint-disable react/no-render-return-value */
import 'babel-polyfill';
import 'font-awesome/css/font-awesome.css';
import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';
import vtkProxyManager from 'vtk.js/Sources/Proxy/Core/ProxyManager';

import ReactDOM from 'react-dom';
import React from 'react';

import './io/ParaViewGlanceReaders';
import './properties';

import defaultConfig from './config/glanceProxyConfig';
import MainView from './MainView';
import * as Controls from './controls';
import ReaderFactory from './io/ReaderFactory';

export const { registerReader } = ReaderFactory;
export const { registerControlTab, unregisterControlTab } = Controls;

export function createViewer(container, proxyConfiguration = defaultConfig) {
  const proxyManager = vtkProxyManager.newInstance({ proxyConfiguration });
  const mainView = ReactDOM.render(
    <MainView proxyManager={proxyManager} />,
    container
  );

  function addDataSet(name, ds, type) {
    const source = proxyManager.createProxy('Sources', 'TrivialProducer', {
      name,
    });
    source.setInputData(ds, type);
    proxyManager.createRepresentationInAllViews(source);
    proxyManager.renderAllViews();
  }

  function progressCallback(event) {
    const progressPercent = Math.round(100 * event.loaded / event.total);
    mainView.setState({ progressPercent });
  }

  function openRemoteDataset(name, url, type) {
    mainView.setState({ showProgress: true });
    ReaderFactory.downloadDataset(name, url, progressCallback)
      .then(({ reader, sourceType }) => {
        addDataSet(name, reader.getOutputData(), type || sourceType);
        mainView.setState({ showProgress: false });
      })
      .catch(console.error);
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
    processURLArgs,
    unbind,
    toggleControl,
    updateTab,
  };
}
