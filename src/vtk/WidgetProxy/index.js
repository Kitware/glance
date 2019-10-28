import macro from 'vtk.js/Sources/macro';

// ----------------------------------------------------------------------------

function addWidgetToView(widget, view) {
  const widgetManager = view.getReferenceByName('widgetManager');
  if (widgetManager) {
    const viewWidget = widgetManager.addWidget(widget);

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

  publicAPI.addToViews = () => {
    model.proxyManager
      .getViews()
      .forEach((view) => addWidgetToView(model.widget, view));
  };

  publicAPI.removeFromViews = () => {
    model.proxyManager
      .getViews()
      .forEach((view) => removeWidgetFromView(model.widget, view));
  };

  const superDelete = publicAPI.delete;
  publicAPI.delete = () => {
    publicAPI.removeFromViews();
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
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  macro.obj(publicAPI, model);
  macro.proxy(publicAPI, model);
  macro.setGet(publicAPI, model, ['name']);
  macro.get(publicAPI, model, ['widget']);

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
