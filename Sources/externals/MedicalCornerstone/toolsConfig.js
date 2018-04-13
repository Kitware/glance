import * as cornerstoneTools from 'cornerstone-tools';

import Tools from './Tools';

import { ToolTypes, MouseButtons } from './Constants';

export default {
  defaults: {
    [ToolTypes.Mouse]: {
      [MouseButtons.Left]: 'wwwc',
      [MouseButtons.Middle]: 'pan',
      [MouseButtons.Right]: 'zoom',
    },
    [ToolTypes.MouseWheel]: {
      // Dummy binding value of true since mouse wheels don't
      // have specific bind slots.
      true: 'stackScroll',
    },
  },
  definitions: {
    pan: {
      tool: cornerstoneTools.pan,
      type: ToolTypes.Mouse,
      binding: MouseButtons.Middle,
      icon: 'arrows-alt',
      activateArgs: ['binding'],
      deactivateArgs: ['binding'],
    },
    zoom: {
      tool: cornerstoneTools.zoom,
      type: ToolTypes.Mouse,
      binding: MouseButtons.Right,
      icon: 'search-plus',
      activateArgs: ['binding'],
      deactivateArgs: ['binding'],
    },
    wwwc: {
      // When using a bundled cornerstone tool, be sure to name
      // the tool as the same name as the cornerstone tool to ensure
      // tool state is synchronized.
      tool: cornerstoneTools.wwwc,
      type: ToolTypes.Mouse,
      // What binding argument for the type of tool.
      binding: MouseButtons.Left,
      // This is a FontAwesome icon name
      icon: 'adjust',
      // Specifies the ordering of arguments. Arguments are provided via
      // an "args" object below.
      // The special name "binding" will take the value of the
      // "binding" property above.
      activateArgs: ['binding'],
      deactivateArgs: ['binding'],
      args: {},

      // tool properties (sets properties on tool object)
      props: {
        strategy: Tools.wwwc.glanceStrategy,
        // strategy: cornerstoneTools.wwwc.strategies.default,
      },

      // tool configuration (calls setConfiguration if possible)
      // configuration: {},

      // Disable syncing in favor of using a custom strategy (above).
      // This is kept here as an example of how to use a cornerstone
      // view synchronizer.
      syncViews: false,
      syncOptions: {
        event: 'cornerstoneimagerendered',
        synchronizer: cornerstoneTools.wwwcSynchronizer,
      },
    },
    probe: {
      tool: cornerstoneTools.probe,
      type: ToolTypes.Mouse,
      binding: MouseButtons.Left,
      icon: 'eye-dropper',
      activateArgs: ['binding'],
      deactivateArgs: ['binding'],
    },
    simpleAngle: {
      tool: cornerstoneTools.simpleAngle,
      type: ToolTypes.Mouse,
      binding: MouseButtons.Left,
      icon: 'angle-down',
      activateArgs: ['binding'],
      deactivateArgs: ['binding'],
    },
    length: {
      tool: cornerstoneTools.length,
      type: ToolTypes.Mouse,
      binding: MouseButtons.Left,
      icon: 'arrows-alt-h',
      activateArgs: ['binding'],
      deactivateArgs: ['binding'],
    },
    ellipticalRoi: {
      tool: cornerstoneTools.ellipticalRoi,
      type: ToolTypes.Mouse,
      binding: MouseButtons.Left,
      icon: 'circle-notch',
      activateArgs: ['binding'],
      deactivateArgs: ['binding'],
    },
    stackScroll: {
      tool: Tools.stackScroll,
      type: ToolTypes.MouseWheel,
      // no binding needed for mousewheel
    },
  },
};
