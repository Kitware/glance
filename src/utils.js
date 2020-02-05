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

/**
 * Wrap a mutation as a vuex action.
 */
export function wrapMutationAsAction(mutation) {
  return ({ commit }, value) => commit(mutation, value);
}

/**
 * Renames keys according to a mapping from old to new key.
 */
export function remapIdKeys(obj, mapping) {
  const newObj = {};
  Object.keys(obj).forEach((id) => {
    let newId = id;
    if (id in mapping) {
      newId = mapping[id];
    }
    newObj[newId] = obj[id];
  });
  return newObj;
}

/**
 * Replaces elements in a list according to a mapping.
 */
export function remapIdList(list, mapping) {
  return list.map((id) => {
    if (id in mapping) {
      return mapping[id];
    }
    return id;
  });
}

/**
 * Curries a function.
 */
export function curry(arity, fn) {
  const appliedArgs = [];
  const curriedFn = (...args) => {
    appliedArgs.push(...args);
    if (appliedArgs.length >= arity) {
      return fn(...appliedArgs.slice(0, arity));
    }
    return curriedFn;
  };
  return curriedFn;
}

export default {
  makeSubManager,
  wrapSub,
  wrapMutationAsAction,
  remapIdKeys,
  remapIdList,
  curry,
};
