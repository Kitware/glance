import { vec3 } from 'gl-matrix';

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

/**
 * Associate a key of VIEW_TYPE_VALUES to axis index and orientation
 * for forward and upward vectors.
 */
const MODE_TO_AXES = {
  default: {
    forwardAxis: 1,
    forwardOrientation: 1,
    upwardAxis: 2,
    upwardOrientation: 1,
  },
  x: {
    forwardAxis: 0,
    forwardOrientation: 1,
    upwardAxis: 2,
    upwardOrientation: 1,
  },
  y: {
    forwardAxis: 1,
    forwardOrientation: 1,
    upwardAxis: 2,
    upwardOrientation: 1,
  },
  z: {
    forwardAxis: 2,
    forwardOrientation: 1,
    upwardAxis: 1,
    upwardOrientation: -1,
  },
};

/**
 * Update the camera view using the given arguments:
 *  - view which is a vtkViewProxy
 *  - basis, a column major matrix defining a basis
 *  - mode, a key of VIEW_TYPE_VALUES
 *  - an optional number of animateSteps
 *
 * The forward vector is computed from the mode argument.
 * The upward vector computed from the forward axis.
 *
 * This function returns a promise which resolves when the animation is done.
 */
export function updateViewOrientationFromBasisAndAxis(
  view,
  basis,
  mode,
  animateSteps = 0
) {
  // Compute forward and upward vectors
  const { forwardAxis, forwardOrientation, upwardAxis, upwardOrientation } =
    MODE_TO_AXES[mode];
  const forwardVector = vec3.scale(
    Array(3),
    basis.slice(forwardAxis * 3, forwardAxis * 3 + 3),
    forwardOrientation
  );
  const upwardVector = vec3.scale(
    Array(3),
    basis.slice(upwardAxis * 3, upwardAxis * 3 + 3),
    upwardOrientation
  );

  // Find camera parameters
  // Adapted from vtkViewProxy.updateOrientation to support arbitrary axis
  const camera = view.getCamera();
  const originalPosition = camera.getPosition();
  const originalViewUp = camera.getViewUp();
  const originalFocalPoint = camera.getFocalPoint();

  const position = vec3.add(Array(3), originalFocalPoint, forwardVector);

  camera.setPosition(...position);
  camera.setViewUp(...upwardVector);

  view.resetCamera();

  const destFocalPoint = camera.getFocalPoint();
  const destPosition = camera.getPosition();
  const destViewUp = camera.getViewUp();

  camera.setFocalPoint(...originalFocalPoint);
  camera.setPosition(...originalPosition);
  camera.setViewUp(...originalViewUp);

  return view.moveCamera(
    destFocalPoint,
    destPosition,
    destViewUp,
    animateSteps
  );
}

export default {
  makeSubManager,
  wrapSub,
  wrapMutationAsAction,
  remapIdKeys,
  remapIdList,
  createRepresentationInAllViews,
  getCropFilter,
  updateViewOrientationFromBasisAndAxis,
};
