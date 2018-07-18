const fs = require('fs');
const path = require('path');

const packageJson = path.resolve(__dirname, '..', 'package.json');
const versionFile = path.resolve(__dirname, '..', 'dist', 'version.js');

const version = require(packageJson).version || 'master';
fs.writeFileSync(versionFile, `window.GLANCE_VERSION = "${version}";\n`);
