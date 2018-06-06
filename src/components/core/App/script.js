import ReaderFactory from 'paraview-glance/src/io/ReaderFactory';

import Landing from 'paraview-glance/src/components/core/Landing';
import LayoutView from 'paraview-glance/src/components/core/LayoutView';

function loadFiles(files) {
  return ReaderFactory.loadFiles(files).then((readers) => {
    ReaderFactory.registerReadersToProxyManager(readers, this.proxyManager);
  });
}

function openFile(url) {
  if (url) {
    // handle remote dataset
  } else {
    ReaderFactory.openFiles(
      // doesn't handle *.raw
      ReaderFactory.listSupportedExtensions(),
      (files) => {
        this.loadFiles(files).then(() => {
          this.landing = false;
        });
      }
    );
  }
}

const data = () => ({
  landing: true,
  sidebar: true,
  activeTab: 0,
});

export default {
  name: 'App',
  inject: ['proxyManager'],
  components: {
    Landing,
    LayoutView,
  },
  data,
  methods: {
    loadFiles,
    openFile,
  },
};
