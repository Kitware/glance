/* Probably could make this a functional mixin like ManagedPxm({ component }) */

import { mapState } from 'vuex';

// we don't support IE, right?
const pxmSubsKey = Symbol('ProxyManagerSubsKey');

export default {
  computed: mapState(['proxyManager']),
  mounted() {
    if (this.$options.proxyManager) {
      const pxm = this.proxyManager;
      const hooks = this.$options.proxyManager;

      this[pxmSubsKey] = [];

      const forwardMethod = (methodName) => {
        if (hooks[methodName]) {
          this[pxmSubsKey].push(pxm[methodName](hooks[methodName].bind(this)));
        }
      };

      forwardMethod('onProxyRegistrationChange');
      forwardMethod('onActiveSourceChange');
      forwardMethod('onActiveViewChange');

      // onSourceDeletion
      if (hooks.onSourceDeletion) {
        this[pxmSubsKey].push(
          pxm.onProxyRegistrationChange((info) => {
            if (info.proxyGroup === 'Sources' && info.action === 'unregister') {
              hooks.onSourceDeletion(info.proxyId);
            }
          })
        );
      }
    }
  },
  beforeDestroy() {
    while (this[pxmSubsKey].length) {
      this[pxmSubsKey].pop().unsubscribe();
    }
  },
  methods: {
    /**
     * Invokes callback on every view.
     * This includes views that will be created in the future.
     *
     * Note: for future views, this does not guarantee the view
     * will have representations. Use forEachRepresentation if you
     * are extracting representations.
     */
    forEachView(callback) {
      const pxm = this.proxyManager;
      pxm.getViews().forEach((view) => callback(view));
      this[pxmSubsKey].push(
        pxm.onProxyRegistrationChange((info) => {
          if (info.proxyGroup === 'Views' && info.action === 'register') {
            callback(info.proxy);
          }
        })
      );
    },

    /**
     * Invokes callback for each representation of a source.
     * This includes representations that will be created in the future.
     */
    forEachRepresentation(source, callback) {
      const pxm = this.proxyManager;
      pxm
        .getRepresentations()
        .filter((rep) => rep.getInput() === source)
        .forEach((view) => callback(view));
      this[pxmSubsKey].push(
        pxm.onProxyRegistrationChange((info) => {
          if (
            info.proxyGroup === 'Representations' &&
            info.action === 'register' &&
            info.proxy.getInput() === source
          ) {
            callback(info.proxy);
          }
        })
      );
    },
  },
};
