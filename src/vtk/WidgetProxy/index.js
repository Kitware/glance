import macro from '@kitware/vtk.js/macro';
import { ViewTypes } from '@kitware/vtk.js/Widgets/Core/WidgetManager/Constants';

// ----------------------------------------------------------------------------

function addWidgetToView(widget, view, widgetType) {
  const widgetManager = view.getReferenceByName('widgetManager');
  if (widgetManager) {
    const viewWidget = widgetManager.addWidget(widget, widgetType);
    widgetManager.enablePicking();
    view.renderLater();
    return viewWidget;
  }
  return null;
}

function removeWidgetFromView(widget, view) {
  const widgetManager = view.getReferenceByName('widgetManager');
  if (widgetManager) {
    widgetManager.removeWidget(widget);
    widgetManager.enablePicking();
    view.renderLater();
  }
}

// ----------------------------------------------------------------------------
// vtkWidgetProxy methods
// ----------------------------------------------------------------------------

function vtkWidgetProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkWidgetProxy');

  model.widget = model.factory.newInstance();

  const cleanupCallbacks = [];
  const stateSub = model.widget
    .getWidgetState()
    .onModified(() => publicAPI.modified());
  const viewWidgets = new WeakSet();

  function forEachView(cb) {
    model.proxyManager.getViews().forEach((view) => {
      const widgetManager = view.getReferenceByName('widgetManager');
      if (widgetManager) {
        cb(view, widgetManager);
      }
    });
  }

  publicAPI.addToViews = () =>
    forEachView((view) => {
      const widgetType = ViewTypes[model.viewTypes[view.getProxyName()]];
      const viewWidget = addWidgetToView(model.widget, view, widgetType);
      if (viewWidget) {
        viewWidgets.add(viewWidget);
      }
    });

  publicAPI.removeFromViews = () =>
    forEachView((view) => removeWidgetFromView(model.widget, view));

  publicAPI.grabFocus = () =>
    forEachView((view, widgetManager) => widgetManager.grabFocus(model.widget));

  publicAPI.releaseFocus = () =>
    forEachView((view, widgetManager) =>
      widgetManager.releaseFocus(model.widget)
    );

  // should only be used after you've called addToViews()
  publicAPI.getViewWidget = (view) => {
    const widgetManager = view.getReferenceByName('widgetManager');
    if (widgetManager) {
      return model.widget.getWidgetForView({
        viewId: widgetManager.getViewId(),
      });
    }
    return null;
  };

  publicAPI.getAllViewWidgets = () =>
    model.proxyManager
      .getViews()
      .map((view) => [publicAPI.getViewWidget(view), view])
      .filter(([vw]) => !!vw);

  publicAPI.executeViewFuncs = (funcs) => {
    forEachView((view, widgetManager) => {
      const fn = funcs[view.getProxyName()];
      if (fn) {
        const viewWidget = publicAPI.getViewWidget(view);
        const cleanup = fn(view, widgetManager, viewWidget);
        if (Array.isArray(cleanup)) {
          for (let i = 0; i < cleanup.length; i++) {
            if (cleanup[i] instanceof Function) {
              cleanupCallbacks.push(cleanup[i]);
            }
          }
        } else if (cleanup instanceof Function) {
          cleanupCallbacks.push(cleanup);
        }
      }
    });
  };

  const superDelete = publicAPI.delete;
  publicAPI.delete = () => {
    stateSub.unsubscribe();
    for (let i = 0; i < cleanupCallbacks.length; i++) {
      cleanupCallbacks[i]();
    }
    model.widget.delete();
    model.widget = null;
    superDelete();
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  name: '',
  widget: null,
  factory: null,
  viewTypes: {},
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  macro.obj(publicAPI, model);
  macro.proxy(publicAPI, model);
  macro.setGet(publicAPI, model, ['name']);
  macro.get(publicAPI, model, ['widget', 'viewTypes']);

  // Object specific methods
  vtkWidgetProxy(publicAPI, model);

  macro.proxyPropertyMapping(publicAPI, model, {
    widgetState: { modelKey: 'widget', property: 'widgetState' },
  });
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkWidgetProxy');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
