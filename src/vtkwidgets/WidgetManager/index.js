import macro from 'vtk.js/Sources/macro';

// ----------------------------------------------------------------------------

function vtkWidgetManager(publicAPI, model) {
  // group name -> array of widgets
  model.groups = {};
  model.subscriptions = [];

  // --------------------------------------------------------------------------

  publicAPI.getGroup = (name) => model.groups[name];

  // --------------------------------------------------------------------------

  publicAPI.updateState = (name, state) => {
    if (model.groups[name]) {
      const group = model.groups[name];
      const oldState = group.state;
      group.state = Object.assign({}, oldState, state);
      if (group.onStateChange) {
        group.onStateChange(group.state, oldState);
      }
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.registerWidgetGroup = (name, widgetSpec) => {
    model.groups[name] = Object.assign(
      {
        representations: [],
        widgets: [],
        state: {},
        updateState: (state) => publicAPI.updateState(name, state),
      },
      widgetSpec
    );
  };

  // --------------------------------------------------------------------------

  publicAPI.newWidget = (name, representation) => {
    if (model.groups[name]) {
      const widget = model.groups[name].new();
      model.groups[name].widgets.push(widget);
      model.groups[name].representations.push(representation.getProxyId());
      return widget;
    }
    return null;
  };

  // --------------------------------------------------------------------------

  publicAPI.destroyWidget = (name, widget) => {
    if (model.groups[name]) {
      const group = model.groups[name];
      const index = group.widgets.indexOf(widget);
      if (index > -1) {
        if (group.onBeforeDestroy) {
          model.groups[name].onBeforeDestroy(widget);
        }
        model.groups[name].widgets.splice(index, 1);
        model.groups[name].representations.splice(index, 1);
      }
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.hasWidget = (name, widget) => {
    if (model.groups[name]) {
      const group = model.groups[name];
      const index = group.widgets.indexOf(widget);
      return index !== -1;
    }
    return false;
  };

  // --------------------------------------------------------------------------

  publicAPI.enable = (name, widget) => {
    const group = model.groups[name];
    if (group && group.enable) {
      const representationId =
        group.representations[group.widgets.indexOf(widget)];
      const representation = model.proxyManager.getProxyById(representationId);
      model.groups[name].enable(widget, representation);
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.disable = (name, widget) => {
    if (model.groups[name] && model.groups[name].disable) {
      model.groups[name].disable(widget);
    }
  };

  // --------------------------------------------------------------------------

  function gcWidgets(repId) {
    let needMoreGc = false;
    Object.keys(model.groups).forEach((name) => {
      const { representations, widgets } = model.groups[name];
      const index = representations.indexOf(repId);
      if (index !== -1) {
        publicAPI.destroyWidget(name, widgets[index]);
        needMoreGc = true;
      }
    });
    if (needMoreGc) {
      gcWidgets(repId);
    }
  }

  // --------------------------------------------------------------------------

  function updateListeners() {
    while (model.subscriptions.length) {
      model.subscriptions.pop().unsubscribe();
    }

    if (model.proxyManager) {
      model.subscriptions.push(
        model.proxyManager.onProxyRegistrationChange((e) => {
          // Remove crop widget if its representation get deleted
          if (e.action === 'unregister') {
            gcWidgets(e.proxyId);
          }
        })
      );
    }
  }

  // --------------------------------------------------------------------------

  publicAPI.setProxyManager = (pm) => {
    model.proxyManager = pm;
    updateListeners();
    publicAPI.modified();
  };

  // --------------------------------------------------------------------------

  const superDelete = publicAPI.delete;
  publicAPI.delete = () => {
    const widgetsToDelete = [];
    Object.keys(model.groups).forEach((name) => {
      const { widgets } = model.groups[name];
      for (let i = 0; i < widgets.length; i++) {
        widgetsToDelete.push({ widget: widgets[i], name });
      }
    });
    while (widgetsToDelete.length) {
      const { name, widget } = widgetsToDelete.pop();
      publicAPI.destroyWidget(name, widget);
    }
    publicAPI.setProxyManager(null);
    superDelete();
  };

  // --------------------------------------------------------------------------

  publicAPI.setProxyManager(model.proxyManager);
}

// ----------------------------------------------------------------------------

function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, initialValues);

  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['proxyManager']);

  vtkWidgetManager(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkWidgetManager');

export default { newInstance, extend };
