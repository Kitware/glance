export function makeSubManager() {
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

export function wrapSub(sub) {
  const subManager = makeSubManager();
  return subManager.sub(sub);
}

export function forAllViews(pxm, callback) {
  pxm.getViews().forEach((view) => callback(view));
  return pxm.onProxyRegistrationChange((info) => {
    if (info.proxyGroup === 'Views' && info.action === 'register') {
      callback(info.proxy);
    }
  });
}

/**
 * Wrap a mutation as a vuex action.
 */
export function wrapMutationAsAction(mutation) {
  return ({ commit }, value) => commit(mutation, value);
}

export default {
  makeSubManager,
  wrapSub,
  forAllViews,
  wrapMutationAsAction,
};
