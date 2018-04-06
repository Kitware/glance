import * as cornerstoneTools from 'cornerstone-tools';

import Tools from './Tools';

import { ToolTypes, MouseButtons } from './Constants';

export default {
  defaults: {
    mouse: {
      [MouseButtons.Left]: 'wwwc',
      [MouseButtons.Middle]: 'pan',
      [MouseButtons.Right]: 'zoom',
    },
  },
  definitions: {
    pan: {
      tool: cornerstoneTools.pan,
      type: ToolTypes.Mouse,
      activateArgs: ['mouseButton'],
      deactivateArgs: ['mouseButton'],
      args: {
        mouseButton: MouseButtons.Middle,
      },
    },
    zoom: {
      tool: cornerstoneTools.zoom,
      type: ToolTypes.Mouse,
      activateArgs: ['mouseButton'],
      deactivateArgs: ['mouseButton'],
      args: {
        mouseButton: MouseButtons.Right,
      },
    },
    wwwc: {
      tool: cornerstoneTools.wwwc,
      type: ToolTypes.Mouse,
      activateArgs: ['mouseButton'],
      deactivateArgs: ['mouseButton'],
      args: {
        mouseButton: MouseButtons.Left,
      },

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
