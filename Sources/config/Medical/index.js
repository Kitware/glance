import ConfigUtils from '../configUtils';
import Generic from '../Generic';

import proxyDefs from './proxyDefs';
import proxyUI from './proxyUI';

const { deepCopyPath, objAssignPath } = ConfigUtils;

function copyAssign(config, path, value) {
  const newConfig = deepCopyPath(config, path);
  objAssignPath(newConfig, path, value);
  return newConfig;
}

let config = Generic;
config = copyAssign(config, 'name', 'Medical');

config = copyAssign(
  config,
  'definitions.Representations.Volume.options.ui',
  proxyUI.Volume
);

// Our views come with lps orientation axes by default
config = copyAssign(config, 'definitions.Views', proxyDefs.Views);

const Medical = config;
export default Medical;
