import ConfigUtils from '../configUtils';
import Generic from '../Generic';

import proxyDefs from './proxyDefs';

const { deepCopyPath, objAssignPath } = ConfigUtils;

function copyAssign(config, path, value) {
  const newConfig = deepCopyPath(config, path);
  objAssignPath(newConfig, path, value);
  return newConfig;
}

let config = Generic;
config = copyAssign(config, 'name', 'Medical');

// Mark piecewise function editor as advanced.
// Assumed to be the 3rd object in the options array from Generic ui config.
config = copyAssign(
  config,
  'definitions.Representations.Volume.options.ui.2.advanced',
  1
);

// Our views come with lps orientation axes by default
config = copyAssign(config, 'definitions.Views', proxyDefs.Views);

const Medical = config;
export default Medical;
