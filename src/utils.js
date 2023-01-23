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
 * Function adapted from getLPSDirections lps.ts from VolView.
 * Associates the column vectors of a 3x3 matrix with the LPS axes.
 *
 * For each of the LPS axes, this function returns the associated column index (0, 1, 2)
 * in the provided 3x3 column-major matrix and the corresponding positive vector.
 *
 * Approach:
 *   - find the max of the direction matrix, ignoring columns and rows marked as done
 *   - assign the column vector of that max value to the row axis
 *   - mark that row and column as done
 *   - continue until all rows and columns are done
 */
export function getLPSDirections(directionMatrix) {
  const axisToLPS = ['l', 'p', 's'];
  const lpsDirs = {};
  // Track the rows and columns that have yet to be assigned.
  const availableCols = [0, 1, 2];
  const availableRows = [0, 1, 2];

  for (let i = 0; i < 3; i++) {
    let bestValue = 0;
    let bestValueLoc = [0, 0]; // col, row
    let removeIndices = [0, 0]; // indices into availableCols/Rows for deletion

    availableCols.forEach((col, colIdx) => {
      availableRows.forEach((row, rowIdx) => {
        const value = directionMatrix[col * 3 + row];
        if (Math.abs(value) > Math.abs(bestValue)) {
          bestValue = value;
          bestValueLoc = [col, row];
          removeIndices = [colIdx, rowIdx];
        }
      });
    });

    // the row index corresponds to the index of the LPS axis
    const [col, axis] = bestValueLoc;
    const axisVector = directionMatrix.slice(col * 3, (col + 1) * 3);
    const vecSign = Math.sign(bestValue);
    const posVector = vec3.scale(Array(3), axisVector, vecSign);
    lpsDirs[axisToLPS[axis]] = {
      axis: col,
      vector: posVector,
    };
    availableCols.splice(removeIndices[0], 1);
    availableRows.splice(removeIndices[1], 1);
  }

  return lpsDirs;
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
 *  - basis, a list of 3 vec3 defining a basis
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
    basis[forwardAxis],
    forwardOrientation
  );
  const upwardVector = vec3.scale(
    Array(3),
    basis[upwardAxis],
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
  getLPSDirections,
  updateViewOrientationFromBasisAndAxis,
};
