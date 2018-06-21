const fs = require('fs');
const path = require('path');

/**
 * Lists externals
 */
function getExternals(basePath) {
  const files = fs.readdirSync(basePath);
  return files.filter((name) => {
    const dir = path.join(basePath, name);
    const entry = path.join(dir, 'index.js');
    try {
      return fs.statSync(dir).isDirectory() && fs.statSync(entry).isFile();
    } catch (e) {
      return false;
    }
  });
}

/**
 * Generates external entries
 */
function getExternalEntries(basePath) {
  let names;
  try {
    names = getExternals(basePath);
  } catch (err) {
    return {};
  }

  const entries = {};
  names.forEach((name) => {
    const entry = path.join(basePath, name, 'index.js');
    entries[`glance-external-${name}`] = entry;
  });

  return entries;
}

/**
 * Generates external expose rules
 *
 * Exposed external modules will have a prefix of 'External' added
 * to their names.
 */
function getExternalExposeRules(basePath) {
  let names;
  try {
    names = getExternals(basePath);
  } catch (err) {
    return [];
  }

  return names.map((name) => ({
    test: path.join(basePath, name, 'index.js'),
    loader: `expose-loader?Glance.externals.${name}`,
  }));
}

module.exports = {
  getExternals,
  getExternalEntries,
  getExternalExposeRules,
};
