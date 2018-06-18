import macro from 'vtk.js/Sources/macro';

// ----------------------------------------------------------------------------

function vtkWidgetManager(publicAPI, model) {
  // group name -> array of widgets
  model.groups = {};

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
        widgets: [],
        state: {},
        updateState: (state) => publicAPI.updateState(name, state),
      },
      widgetSpec
    );
  };

  // --------------------------------------------------------------------------

  publicAPI.newWidget = (name) => {
    if (model.groups[name]) {
      const widget = model.groups[name].new();
      model.groups[name].widgets.push(widget);
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
      }
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.enable = (name, widget) => {
    if (model.groups[name] && model.groups[name].enable) {
      model.groups[name].enable(widget);
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.disable = (name, widget) => {
    if (model.groups[name] && model.groups[name].disable) {
      model.groups[name].disable(widget);
    }
  };
}

// ----------------------------------------------------------------------------

function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, initialValues);

  macro.obj(publicAPI, model);

  vtkWidgetManager(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkWidgetManager');

export default { newInstance, extend };
