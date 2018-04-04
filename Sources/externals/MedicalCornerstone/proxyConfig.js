import ConfigUtils from '../../config/configUtils';

// Base this config off of medical
import Medical from '../../config/Medical';

import proxyDefs from './proxyDefs';

const { deepCopyPath, objAssignPath } = ConfigUtils;

function copyAssign(config, path, value) {
  const newConfig = deepCopyPath(config, path);
  objAssignPath(newConfig, path, value);
  return newConfig;
}

let config = Medical.Proxy;

// use cornerstone views
config = copyAssign(config, 'definitions.Views', proxyDefs.Views);

// Use cornerstone representations
['SliceX', 'SliceY', 'SliceZ'].forEach((slice) => {
  config = copyAssign(
    config,
    `definitions.Representations.${slice}`,
    proxyDefs.Slices[slice]
  );
});

const MedicalCornerstone = config;
export default MedicalCornerstone;