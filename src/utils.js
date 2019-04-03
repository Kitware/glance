function makeSubManager() {
  let currentSub = null;

  const api = {
    sub(subscription) {
      api.unsub();
      currentSub = subscription;
    },
    unsub() {
      if (currentSub !== null) {
        currentSub.unsubscribe();
        currentSub = null;
      }
    },
  };

  return api;
}

function wrapSub(sub) {
  const subManager = makeSubManager();
  return subManager.sub(sub);
}

function forAllViews(pxm, callback) {
  pxm.getViews().forEach((view) => callback(view));
  return pxm.onProxyRegistrationChange((info) => {
    if (info.proxyGroup === 'Views' && info.action === 'register') {
      callback(info.proxy);
    }
  });
}

export default {
  makeSubManager,
  wrapSub,
  forAllViews,
};
