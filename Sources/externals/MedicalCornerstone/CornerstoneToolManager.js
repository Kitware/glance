import macro from 'vtk.js/Sources/macro';

import * as cornerstoneTools from 'cornerstone-tools';

import vtkCornerstoneToolStateManager from './CornerstoneToolStateManager';
import { InputSources } from './Constants';

const { vtkErrorMacro } = macro;

function partial(func, ...partialArgs) {
  return (...args) => func(...partialArgs, ...args);
}

function CornerstoneToolManager(publicAPI, model) {
  model.classHierarchy.push('vtkCornerstoneToolManager');

  // Private ------------------------------------------------------------------

  function toolFromConfig(name, config) {
    const tool = config.tool;
    if (!tool) {
      return null;
    }

    // private vars
    let activateArgs = null;
    let state = {
      action: 'disable',
      args: {},
    };

    function invoke(action, elements, opts) {
      if (tool[action]) {
        const argMapping = Object.assign(
          { binding: config.binding },
          config.args
        );
        if (state.action === 'activate' && action === 'deactivate') {
          // use original activate args so we correctly
          // deactivate, e.g. on the same mouse bindings
          Object.assign(argMapping, activateArgs);
        }
        Object.assign(argMapping, opts);

        const args = (config[`${action}Args`] || []).map(
          (argName) => argMapping[argName]
        );

        if (elements instanceof Array) {
          elements.forEach((element) => tool[action](element, ...args));
        } else {
          tool[action](elements, ...args);
        }
        state = { action, argMapping };

        if (action === 'activate') {
          // save activate args for a future deactivate
          activateArgs = argMapping;
        }
      }
    }

    if (config.props) {
      // set properties
      Object.keys(config.props).forEach((prop) => {
        tool[prop] = config.props[prop];
      });
    }

    if (config.configuration && tool.setConfiguration) {
      tool.setConfiguration(config.configuration);
    }

    if (config.syncViews && config.syncOptions) {
      const { event, synchronizer } = config.syncOptions;
      const synch = new cornerstoneTools.Synchronizer(event, synchronizer);

      model.synchronizers.push({
        toolName: name,
        synchronizer: synch,
      });
    }

    return {
      name,
      config,
      get state() {
        return state;
      },
      enable: partial(invoke, 'enable'),
      disable: partial(invoke, 'disable'),
      activate: partial(invoke, 'activate'),
      deactivate: partial(invoke, 'deactivate'),
      setConfiguration: tool.setConfiguration,
      getConfiguration: tool.getConfiguration,
    };
  }

  function invokeTool(name, action, overrides = {}) {
    if (name in model.tools) {
      model.tools[name][action](model.elements, overrides);

      // update slots
      const isBind = action === 'enable' || action === 'activate';
      const toolType = model.tools[name].config.type;
      const binding = overrides.binding || model.tools[name].config.binding;

      if (isBind) {
        const curSlotTool = model.inputSlots[toolType][binding];
        if (curSlotTool) {
          // all unbound tools should still be interactive, so
          // in a passive state.
          publicAPI.deactivateTool(curSlotTool);
        }
        model.inputSlots[toolType][binding] = name;
      } else {
        model.inputSlots[toolType][binding] = '';
      }
    }
  }

  function invokeInputSources(method, element) {
    Object.values(model.toolConfiguration.definitions).forEach((definition) => {
      const inputSource = InputSources[definition.type];
      cornerstoneTools[inputSource][method](element);
    });
  }

  function reset() {
    model.tools = Object.create(null);
    model.synchronizers = [];
    model.elements = [];
    model.inputSlots = {};
  }

  function applyToolConfiguration() {
    const config = model.toolConfiguration;

    Object.keys(config.definitions).forEach((name) => {
      const definition = config.definitions[name];
      publicAPI.registerTool(toolFromConfig(name, definition));

      // setup an input slot if it's not created
      if (!model.inputSlots[definition.type]) {
        model.inputSlots[definition.type] = {};
      }
      if (!model.inputSlots[definition.type][definition.binding]) {
        model.inputSlots[definition.type][definition.binding] = '';
      }
    });

    if (config.defaults) {
      Object.keys(config.defaults).forEach((toolType) => {
        const defaults = config.defaults[toolType];
        Object.keys(defaults).forEach((binding) => {
          const tool = model.tools[defaults[binding]];
          // tooltype is of type String from Object.keys
          if (tool && tool.config.type === Number(toolType)) {
            publicAPI.activateTool(defaults[binding], { binding });
          }
        });
      });
    }
  }

  function attachListeners(element, shouldBind) {
    const method = shouldBind ? 'addEventListener' : 'removeEventListener';
    element[method](
      cornerstoneTools.EVENTS.MEASUREMENT_ADDED,
      publicAPI.invokeMeasurementAdded
    );
    element[method](
      cornerstoneTools.EVENTS.MEASUREMENT_MODIFIED,
      publicAPI.invokeMeasurementModified
    );
    element[method](
      cornerstoneTools.EVENTS.MEASUREMENT_REMOVED,
      publicAPI.invokeMeasurementRemoved
    );
  }

  // Setup --------------------------------------------------------------------

  reset();

  // Public -------------------------------------------------------------------

  publicAPI.registerTool = (tool) => {
    // allow for overwriting existing tools
    model.tools[tool.name] = tool;
  };

  publicAPI.unregisterTool = (toolName) => {
    if (model.tools[toolName].state !== 'disable') {
      publicAPI.disable(toolName);
    }
    delete model.tools[toolName];
  };

  publicAPI.activateTool = (toolName, overrides) =>
    invokeTool(toolName, 'activate', overrides);

  publicAPI.deactivateTool = (toolName, overrides) =>
    invokeTool(toolName, 'deactivate', overrides);

  publicAPI.enableTool = (toolName, overrides) =>
    invokeTool(toolName, 'enable', overrides);

  publicAPI.disableTool = (toolName, overrides) =>
    invokeTool(toolName, 'disable', overrides);

  publicAPI.disableAllTools = () =>
    Object.keys(model.tools).forEach((name) => publicAPI.disableTool(name));

  publicAPI.applyTools = (element) => {
    Object.values(model.tools).forEach((tool) => {
      const state = tool.state;
      tool[state.action](element, state.args);
    });
  };

  publicAPI.getTool = (name) => model.tools[name];

  publicAPI.getMeasurements = (element) => {
    const measurements = {};
    Object.keys(model.tools).forEach((toolName) => {
      const state = cornerstoneTools.getToolState(element, toolName);
      measurements[toolName] = (state || {}).data || [];
    });
    return measurements;
  };

  publicAPI.setMeasurementData = (el, toolType, measurementData, newData) =>
    cornerstoneTools
      .getElementToolStateManager(el)
      .setData(el, toolType, measurementData, newData);

  publicAPI.deleteMeasurement = (el, toolType, measurementData) =>
    cornerstoneTools
      .getElementToolStateManager(el)
      .removeData(el, toolType, measurementData);

  publicAPI.setupElement = (element) => {
    if (model.elements.indexOf(element) === -1) {
      model.elements.push(element);
      cornerstoneTools.setElementToolStateManager(
        element,
        vtkCornerstoneToolStateManager.newInstance()
      );
      invokeInputSources('enable', element);
      attachListeners(element, true);
      model.synchronizers.forEach((s) => s.synchronizer.add(element));
      publicAPI.applyTools(element);
    }
  };

  publicAPI.teardownElement = (element) => {
    const index = model.elements.indexOf(element);
    if (index !== -1) {
      model.synchronizers.forEach((s) => s.synchronizer.remove(element));
      invokeInputSources('disable', element);
      attachListeners(element, false);
      model.elements.splice(index, 1);
    }
  };

  // Initialization -----------------------------------------------------------

  if (model.toolConfiguration) {
    applyToolConfiguration();
  } else {
    vtkErrorMacro('Tool configuration not provided at instantiation');
  }
}

function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, initialValues);

  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['tools', 'toolConfiguration', 'inputSlots']);

  ['measurementAdded', 'measurementModified', 'measurementRemoved'].forEach(
    (ev) => macro.event(publicAPI, model, ev)
  );

  CornerstoneToolManager(publicAPI, model);
}

export const newInstance = macro.newInstance(
  extend,
  'vtkCornerstoneToolManager'
);

export default { newInstance, extend };
