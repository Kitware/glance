const path = require('path');

const plugins = [];
const entry = path.join(__dirname, './Sources/index.js');
const sourcePath = path.join(__dirname, './Sources');
const outputPath = path.join(__dirname, './Distribution');

const linterRules = require('./Utilities/rules/linter.js');
const explorerRules = require('./Utilities/rules/explorer.js');
const vtkRules = require('./Utilities/rules/vtkjs.js');
const pvwRules = require('./Utilities/rules/paraviewweb.js');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// plugins.push(new BundleAnalyzerPlugin());

module.exports = {
  plugins,
  entry,
  output: {
    path: outputPath,
    filename: 'pv-web-viewer.js',
  },
  module: {
    rules: [].concat(linterRules, explorerRules, vtkRules, pvwRules),
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), sourcePath],
    alias: {
      'pv-explorer': __dirname,
      PVWStyle: path.resolve('./node_modules/paraviewweb/style'),
    },
  },
  devServer: {
    contentBase: outputPath,
    port: 9999,
    host: '0.0.0.0',
    disableHostCheck: true,
    hot: false,
    quiet: false,
    noInfo: false,
    stats: {
      colors: true,
    },
  },
};
