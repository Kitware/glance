import { VIEW_ORIENTATIONS } from 'paraview-glance/src/components/core/VtkView/constants';

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
  };

  // To crop we need at list an image data
  proxyManager.getSources().forEach((s) => {
    const ds = s.getDataset();
    if (ds && ds.isA && ds.isA('vtkImageData')) {
      possibleActions.crop = true;
    }
  });

  return possibleActions;
}

// ----------------------------------------------------------------------------

function getViewType(view) {
  return `${view.getProxyName()}:${view.getReferenceByName('name')}`;
}

// ----------------------------------------------------------------------------

function getView(proxyManager, viewType, container) {
  const [type, name] = viewType.split(':');
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

    // set background to transparent
    view.setBackground(0, 0, 0, 0);
  }

  if (container) {
    view.setContainer(container);
    view.resize();
  }

  return view;
}

// ----------------------------------------------------------------------------

function bindView(proxyManager, viewType, container) {
  return getView(proxyManager, viewType, container);
}

// ----------------------------------------------------------------------------

export default {
  getViewType,
  bindView,
  getView,
  getViewActions,
  getNumberOfVisibleViews,
};
