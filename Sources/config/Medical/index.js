import ConfigUtils from '../configUtils';
import Generic from '../Generic';

import ColorMaps from './ColorMaps';
import proxyDefs from './proxyDefs';

const { deepCopyPath, objAssignPath } = ConfigUtils;

function copyAssign(config, path, value) {
  const newConfig = deepCopyPath(config, path);
  objAssignPath(newConfig, path, value);
  return newConfig;
}

function indexOf(arr, test) {
  let index = -1;
  for (let i = 0; i < arr.length; ++i) {
    if (test(arr[i], i, arr)) {
      index = i;
      break;
    }
  }
  return index;
}

let config = Generic;
config = copyAssign(config, 'name', 'Medical');

// Mark piecewise function editor as advanced.
const pwfIndex = indexOf(
  config.definitions.Representations.Volume.options.ui,
  (uiElement) => uiElement.name === 'piecewiseFunctionProxy'
);
config = copyAssign(
  config,
  `definitions.Representations.Volume.options.ui.${pwfIndex}.advanced`,
  1
);

// Extend Generic colormap with Medical colormaps
const lutIndex = indexOf(
  config.definitions.Representations.Volume.options.ui,
  (uiElement) => uiElement.name === 'lookupTableProxy'
);
config = copyAssign(
  config,
  `definitions.Representations.Volume.options.ui.${lutIndex}.domain.colormaps`,
  ColorMaps
);

// Our views come with lps orientation axes by default
config = copyAssign(config, 'definitions.Views', proxyDefs.Views);

const Medical = config;
export default Medical;
