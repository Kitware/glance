import ReaderFactory from 'paraview-glance/src/io/ReaderFactory';

import { Events, Messages } from 'paraview-glance/src/constants';
import Landing from 'paraview-glance/src/components/core/Landing';
import LayoutView from 'paraview-glance/src/components/core/LayoutView';
import Notification from 'paraview-glance/src/components/core/Notification';

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
        this.loadFiles(files)
          .then(() => {
            this.landing = false;
          })
          .catch((error) => {
            if (error) {
              this.$eventBus.$emit(Events.MSG_ERROR, Messages.OPEN_ERROR);
            }
            // TODO display popup for raw parsing
            this.$eventBus.$emit(Events.MSG_INFO, 'TODO interpret as *.raw');
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
    Notification,
  },
  data,
  methods: {
    loadFiles,
    openFile,
  },
};
