const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packageJson = path.resolve(__dirname, '..', 'package.json');
const versionFile = path.resolve(__dirname, '..', 'dist', 'version.js');
const gitTag = execSync('git tag -l --points-at HEAD').toString().trim();

let version = gitTag || require(packageJson).version;
if (!version || version === '0.0.0-semantically-release') {
  version = 'master';
}

fs.writeFileSync(versionFile, `window.GLANCE_VERSION = "${version}";\n`);
