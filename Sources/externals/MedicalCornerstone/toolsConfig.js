import * as cornerstoneTools from 'cornerstone-tools';

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
    },
  },
};
