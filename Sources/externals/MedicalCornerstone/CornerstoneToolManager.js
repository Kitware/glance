import macro from 'vtk.js/Sources/macro';

import * as cornerstoneTools from 'cornerstone-tools';

import { InputSources, MouseButtons } from './Constants';

function partial(func, ...partialArgs) {
  return (...args) => func(...partialArgs, ...args);
}

function CornerstoneToolManager(publicAPI, model) {
  model.classHierarchy.push('vtkCornerstoneToolManager');

  // Private ------------------------------------------------------------------

  function toolFromConfig(config) {
    const tool = config.tool;
    if (!tool) {
      return null;
    }

    function invoke(method, element, opts) {
      if (tool[method]) {
        const args = (config[`${method}Args`] || []).map(
          (argName) => config.args[argName]
        );
        tool[method](element, ...args);
      }
    }

    return {
      enable: partial(invoke, 'enable'),
      disable: partial(invoke, 'disable'),
      activate: partial(invoke, 'activate'),
      deactivate: partial(invoke, 'deactivate'),
      setConfiguration: tool.setConfiguration,
      getConfiguration: tool.getConfiguration,
    };
  }

  function invokeTool(name, method, element) {
    if (name in model.tools) {
      model.tools[name][method](element);
    }
  }

  function invokeInputSources(method, element) {
    Object.values(model.toolConfiguration.definitions).forEach((definition) => {
      const inputSource = InputSources[definition.type];
      cornerstoneTools[inputSource][method](element);
    });
  }

  // Setup --------------------------------------------------------------------

  model.tools = Object.create(null);

  // Public -------------------------------------------------------------------

  publicAPI.setToolConfiguration = (config, force = false) => {
    if (model.toolConfiguration === config && !force) {
      return;
    }

    // if config is null, then unregister all tools anyways
    model.tools = Object.create(null);
    model.toolConfiguration = config;

    if (config) {
      Object.keys(config.definitions).forEach((name) =>
        publicAPI.registerTool(name, toolFromConfig(config.definitions[name]))
      );
    }

    publicAPI.modified();
  };

  publicAPI.registerTool = (toolName, tool) => {
    // allow for overwriting existing tools
    model.tools[toolName] = tool;
  };

  publicAPI.unregisterTool = (toolName) => delete model.tools[toolName];

  publicAPI.activateTool = (toolName, element) =>
    invokeTool(toolName, 'activate', element);

  publicAPI.deactivateTool = (toolName, element) =>
    invokeTool(toolName, 'deactivate', element);

  publicAPI.enableTool = (toolName, element) =>
    invokeTool(toolName, 'enable', element);

  publicAPI.disableTool = (toolName, element) =>
    invokeTool(toolName, 'disable', element);

  publicAPI.disableAllTools = (element) => {
    Object.keys(model.tools).forEach((name) =>
      publicAPI.disableTool(name, element)
    );
  };

  publicAPI.resetToDefaults = (element) => {
    // disable all tools, then enable only defaults
    publicAPI.disableAllTools(element);
    if (model.toolConfiguration.defaults) {
      if (model.toolConfiguration.defaults.mouse) {
        const mouseDefaults = model.toolConfiguration.defaults.mouse;
        [MouseButtons.Left, MouseButtons.Middle, MouseButtons.Right].forEach(
          (btn) => {
            if (mouseDefaults[btn]) {
              publicAPI.activateTool(mouseDefaults[btn], element);
            }
          }
        );
      }
    }
  };

  publicAPI.setupElement = macro.chain(
    (element) => invokeInputSources('enable', element),
    publicAPI.resetToDefaults
  );

  publicAPI.teardownElement = (element) =>
    invokeInputSources('disable', element);

  // Initialization -----------------------------------------------------------

  if (model.toolConfiguration) {
    publicAPI.setToolConfiguration(model.toolConfiguration, true);
  }
}

function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, initialValues);

  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['toolConfiguration']);

  CornerstoneToolManager(publicAPI, model);
}

export const newInstance = macro.newInstance(
  extend,
  'vtkCornerstoneToolManager'
);

export default { newInstance, extend };
