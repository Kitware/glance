function newInstance(updateFn, getAllProxiesFn) {
  const subscriptions = [];

  function removeListeners() {
    while (subscriptions.length) {
      subscriptions.pop().unsubscribe();
    }
  }

  function listenToProxyChange(proxy) {
    subscriptions.push(proxy.onModified(updateFn));
  }

  function resetListeners() {
    removeListeners();
    getAllProxiesFn().forEach(listenToProxyChange);
  }

  return Object.freeze({
    removeListeners,
    listenToProxyChange,
    resetListeners,
  });
}

export default { newInstance };
