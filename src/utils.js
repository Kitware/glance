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
 * Renames values in an object according to a lookup.
 */
export function remapIdValues(obj, mapping) {
  const newObj = {};
  Object.entries(obj).forEach(([key, id]) => {
    let newId = id;
    if (id in mapping) {
      newId = mapping[id];
    }
    newObj[key] = newId;
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

/**
 * Retrieves the volume cropping filter, if any, of a source proxy.
 */
export function getCropFilter(pxm, proxy) {
  // find 3d view
  const view3d = pxm.getViews().find((v) => v.getProxyName() === 'View3D');

  if (!view3d) {
    throw new Error('Cannot find 3D view!');
  }

  // find volume rep
  const volRep = pxm.getRepresentation(proxy, view3d);

  if (!volRep || !volRep.getCropFilter) {
    throw new Error('Cannot find the volume rep with a crop filter!');
  }

  return volRep.getCropFilter();
}

export default {
  makeSubManager,
  wrapSub,
  wrapMutationAsAction,
  remapIdKeys,
  remapIdList,
  createRepresentationInAllViews,
  getCropFilter,
};
