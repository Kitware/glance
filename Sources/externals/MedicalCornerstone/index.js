import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';

import * as cornerstone from 'cornerstone-core';

import ImageLoader from './CornerstoneImageLoader';
import proxyConfig from './proxyConfig';

cornerstone.registerImageLoader('vtkImage', ImageLoader.loader);

const Glance = (typeof window === 'undefined' ? {} : window).Glance;
const { mode } = vtkURLExtract.extractURLParameters();

if (Glance && mode === 'Medical') {
  Glance.setActiveProxyConfiguration(proxyConfig);
}
