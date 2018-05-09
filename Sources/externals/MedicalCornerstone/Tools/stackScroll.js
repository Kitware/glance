import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

import { GLANCE_DATA } from '../Constants';

function mouseWheelCallback(ev) {
  const { element, direction } = ev.detail;

  const data = cornerstone.getElementData(element, GLANCE_DATA);
  if (data.currentRepresentation) {
    data.currentRepresentation.setSlice(
      data.currentRepresentation.getSlice() - direction
    );
  }
}

export default cornerstoneTools.mouseWheelTool(mouseWheelCallback);
