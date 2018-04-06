import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

import { GLANCE_DATA } from '../Constants';

export function glanceStrategy(eventData) {
  cornerstoneTools.wwwc.strategies.default(eventData);

  const rep = cornerstone.getElementData(eventData.element, GLANCE_DATA)
    .currentRepresentation;
  if (rep) {
    rep.setColorWindow(eventData.viewport.voi.windowWidth);
    rep.setColorLevel(eventData.viewport.voi.windowCenter);
  }
}

export default {
  glanceStrategy,
};
