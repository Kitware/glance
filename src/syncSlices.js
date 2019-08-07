export default function syncSlices(proxyManager) {
  const sliceToView = {};
  const viewSliceValue = {};
  const repSubs = {};

  const synchronize = (updatedProxy) => {
    const proxyId = updatedProxy.getProxyId();
    const slice = updatedProxy.getSlice();
    if (proxyId in sliceToView) {
      const viewId = sliceToView[proxyId];
      const view = proxyManager.getProxyById(viewId);
      view.getRepresentations().forEach((rep) => {
        if (rep !== updatedProxy) {
          rep.setSlice(slice);
        }
      });

      viewSliceValue[viewId] = slice;
    }
  };

  return proxyManager.onProxyRegistrationChange((info) => {
    const { action, proxy, proxyId, proxyGroup } = info;
    // ensure we are receiving a setSlice-compatible representation
    if (proxyGroup === 'Representations' && 'setSlice' in proxy) {
      if (action === 'register') {
        const views2D = proxyManager
          .getViews()
          .filter((v) => v.getClassName() === 'vtkView2DProxy');

        for (let i = 0; i < views2D.length; i++) {
          const view = views2D[i];
          const viewId = view.getProxyId();
          if (view.getRepresentations().indexOf(proxy) > -1) {
            sliceToView[proxyId] = viewId;
            repSubs[proxyId] = proxy.onModified(synchronize);

            if (viewId in viewSliceValue) {
              proxy.setSlice(viewSliceValue[viewId]);
            }

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
