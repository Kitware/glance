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
  },
};
