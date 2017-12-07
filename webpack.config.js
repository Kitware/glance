const path = require('path');

const entry = path.join(__dirname, './Sources/index.js');
const sourcePath = path.join(__dirname, './Sources');
const outputPath = path.join(__dirname, './Distribution');

const linterRules = require('./Utilities/rules/linter.js');
const explorerRules = require('./Utilities/rules/explorer.js');
const vtkRules = require('./Utilities/rules/vtkjs.js');

module.exports = {
  entry,
  output: {
    path: outputPath,
    filename: 'pv-web-viewer.js',
  },
  module: {
    rules: [].concat(linterRules, explorerRules, vtkRules),
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      sourcePath,
    ],
    alias: {
      'pv-explorer': __dirname,
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
