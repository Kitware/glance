import macro from 'vtk.js/Sources/macro';

// ----------------------------------------------------------------------------

function vtkWidgetManager(publicAPI, model) {
  // group name -> array of widgets
  const groups = {};
  const widgetToGroupNameAndContextId = new Map();
  const subscriptions = [];

  // --------------------------------------------------------------------------

  publicAPI.registerWidgetGroup = (name, widgetSpec) => {
    groups[name] = Object.assign(
      {
        contexts: {},
      },
      widgetSpec
    );
  };

  // --------------------------------------------------------------------------

  publicAPI.newWidget = (name, proxyAsContext) => {
    if (groups[name]) {
      const widget = groups[name].newWidget();
      const id = proxyAsContext.getProxyId();
      if (!groups[name].contexts[id]) {
        groups[name].contexts[id] = {
          proxy: proxyAsContext,
          widgets: [],
          state: {},
        };
      }
      const ctx = groups[name].contexts[id];
      ctx.widgets.push({ widget, subscriptions: [] });

      widgetToGroupNameAndContextId.set(widget, { name, id });

      return widget;
    }
    return null;
  };

  // --------------------------------------------------------------------------

  publicAPI.destroyWidget = (widget) => {
    const { name, id } = widgetToGroupNameAndContextId.get(widget) || {};
    const group = groups[name];
    const ctx = group ? group.contexts[id] : null;
    if (group && ctx) {
      const entry = ctx.widgets.find((w) => w.widget === widget);
      if (entry) {
        // Remove listeners
        while (entry.subscriptions.length) {
          entry.subscriptions.pop().unsubscribe();
        }

        // Delete widget
        if (group.onBeforeDestroy) {
          group.onBeforeDestroy(widget);
        }

        // Update internal structures
        ctx.widgets = ctx.widgets.filter((w) => w.widget !== widget);
        widgetToGroupNameAndContextId.delete(widget);
      }
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.hasWidget = (widget) => widgetToGroupNameAndContextId.has(widget);

  // --------------------------------------------------------------------------

  publicAPI.enable = (widget) => {
    const { name, id } = widgetToGroupNameAndContextId.get(widget) || {};
    const group = groups[name];
    const ctx = group ? group.contexts[id] : null;
    if (group && group.enable) {
      const entry = ctx.widgets.find((w) => w.widget === widget);
      const newSubscriptions = [].concat(group.enable(widget, ctx));
      newSubscriptions.forEach((s) => entry.subscriptions.push(s));
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.disable = (widget) => {
    const { name } = widgetToGroupNameAndContextId.get(widget) || {};
    const group = groups[name];
    if (group && group.disable) {
      group.disable(widget);
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.destroyWidgetFromContextProxy = (proxyId) => {
    Object.keys(groups).forEach((name) => {
      const { widgets } = groups[name].contexts[proxyId] || {};
      if (widgets) {
        widgets.map((w) => w.widget).forEach(publicAPI.destroyWidget);
      }
      delete groups[name].contexts[proxyId];
    });
  };

  // --------------------------------------------------------------------------

  function updateListeners() {
    while (subscriptions.length) {
      subscriptions.pop().unsubscribe();
    }

    if (model.proxyManager) {
      subscriptions.push(
        model.proxyManager.onProxyRegistrationChange((e) => {
          // Remove any widget dependent of that proxy
          if (e.action === 'unregister') {
            publicAPI.destroyWidgetFromContextProxy(e.proxyId);
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
    Object.keys(groups).forEach((name) => {
      const group = groups[name];
      Object.keys(group.contexts).forEach(
        publicAPI.destroyWidgetFromContextProxy
      );
    });
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
