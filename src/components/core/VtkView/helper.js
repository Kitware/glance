import {
  VIEW_ORIENTATIONS,
  VIEW_TYPES,
} from 'paraview-glance/src/components/core/VtkView/constants';

// ----------------------------------------------------------------------------

function getNumberOfVisibleViews(proxyManager) {
  let nbViews = 0;
  proxyManager.getViews().forEach((v) => {
    nbViews += v.getContainer() ? 1 : 0;
  });
  return nbViews;
}

// ----------------------------------------------------------------------------

function getViewActions(proxyManager) {
  const possibleActions = {
    crop: false,
    split: false,
    single: false,
  };

  // To crop we need at list an image data
  proxyManager.getSources().forEach((s) => {
    const ds = s.getDataset();
    if (ds && ds.isA && ds.isA('vtkImageData')) {
      possibleActions.crop = true;
    }
  });

  // Count number of view in UI
  const nbViews = getNumberOfVisibleViews(proxyManager);
  possibleActions.split = nbViews < 4;
  possibleActions.single = nbViews > 1;

  return possibleActions;
}

// ----------------------------------------------------------------------------

function getView(proxyManager, type, name, container) {
  let view = null;
  const views = proxyManager.getViews();
  for (let i = 0; i < views.length; i++) {
    if (views[i].getProxyName() === type) {
      if (name) {
        if (views[i].getReferenceByName('name') === name) {
          view = views[i];
        }
      } else {
        view = views[i];
      }
    }
  }

  if (!view) {
    view = proxyManager.createProxy('Views', type, { name });

    // Make sure represention is created for new view
    proxyManager
      .getSources()
      .forEach((s) => proxyManager.getRepresentation(s, view));

    // Update orientation
    const { axis, orientation, viewUp } = VIEW_ORIENTATIONS[name];
    view.updateOrientation(axis, orientation, viewUp);
  }

  if (container) {
    view.setContainer(container);
    view.resize();
  }

  return view;
}

// ----------------------------------------------------------------------------

function bindView(proxyManager, viewType, container) {
  const [type, name] = viewType.split(':');
  return getView(proxyManager, type, name, container);
}

// ----------------------------------------------------------------------------

function getViews(proxyManager, count = 1, current = null) {
  const views = proxyManager.getViews();
  if (views.length === count) {
    // FIXME preserve order
    return views;
  }

  const sortedViews = [];
  for (let i = 0; i < VIEW_TYPES.length && i < count; i++) {
    const [type, name] = VIEW_TYPES[i].value.split(':');
    sortedViews.push(getView(proxyManager, type, name));
  }

  const result = [];
  switch (count) {
    case 1:
      result.push(current || sortedViews[0]);
      break;
    case 2:
      result.push(sortedViews[1]);
      result.push(sortedViews[0]);
      break;
    case 4:
      result.push(sortedViews[1]);
      result.push(sortedViews[0]);
      result.push(sortedViews[2]);
      result.push(sortedViews[3]);
      break;
    default:
      result.push(sortedViews[0]);
      break;
  }
  console.log('sortedViews', sortedViews);
  console.log('viewToShow', result);
  return result;
}

// ----------------------------------------------------------------------------

export default {
  getViews,
  bindView,
  getView,
  getViewActions,
  getNumberOfVisibleViews,
};
