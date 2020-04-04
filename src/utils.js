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
 * A wrapper function for pxm.createRepresentationInAllViews that
 * correctly manages which representation is bound to 2D manipulators.
 */
export function createRepresentationInAllViews(pxm, source) {
  const views2D = pxm.getViews().filter((v) => v.isA('vtkView2DProxy'));
  // reach in to get sliceRepresentation, since it's not default exposed
  const origReps = views2D.map((v) =>
    v.getReferenceByName('sliceRepresentation')
  );

  pxm.createRepresentationInAllViews(source);

  // do not focus labelmaps
  if (source.getProxyName() === 'LabelMap') {
    views2D.forEach((view, i) =>
      view.bindRepresentationToManipulator(origReps[i])
    );
  }
}

export default {
  makeSubManager,
  wrapSub,
  wrapMutationAsAction,
  remapIdKeys,
  remapIdList,
  createRepresentationInAllViews,
};
