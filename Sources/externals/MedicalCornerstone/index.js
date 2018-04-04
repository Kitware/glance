import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';

import proxyConfig from './proxyConfig';

const Glance = (typeof window === 'undefined' ? {} : window).Glance;
const { mode } = vtkURLExtract.extractURLParameters();

if (Glance && mode === 'Medical') {
  Glance.setActiveProxyConfiguration(proxyConfig);
}
