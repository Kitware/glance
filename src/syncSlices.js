export default function syncSlices(proxyManager) {
  const sliceToView = {};
  const repSubs = {};

  const synchronize = (updatedProxy) => {
    const proxyId = updatedProxy.getProxyId();
    const slice = updatedProxy.getSlice();
    if (proxyId in sliceToView) {
      const viewId = sliceToView[proxyId];
      const view = proxyManager.getProxyById(viewId);
      view.getRepresentations().forEach((rep) => {
        if (rep.setSlice && rep !== updatedProxy) {
          rep.setSlice(slice);
        }
      });
    }
  };

  return proxyManager.onProxyRegistrationChange((info) => {
    const { action, proxy, proxyId, proxyGroup } = info;
    if (proxyGroup === 'Representations') {
      if (action === 'register') {
        const views2D = proxyManager
          .getViews()
          .filter((v) => v.getClassName() === 'vtkView2DProxy');

        for (let i = 0; i < views2D.length; i++) {
          const view = views2D[i];
          if (view.getRepresentations().indexOf(proxy)) {
            sliceToView[proxyId] = view.getProxyId();
            repSubs[proxyId] = proxy.onModified(synchronize);
            break;
          }
        }
      } else if (action === 'unregister') {
        if (repSubs[proxyId]) {
          repSubs[proxyId].unsubscribe();
          delete repSubs[proxyId];
        }
      }
    }
  });
}
