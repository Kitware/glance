const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const plugins = [];
const entry = path.join(__dirname, './Sources/index.js');
const sourcePath = path.join(__dirname, './Sources');
const outputPath = path.join(__dirname, './Distribution');

const linterRules = require('./Utilities/rules/linter.js');
const glanceRules = require('./Utilities/rules/glance.js');
const vtkRules = require('./Utilities/rules/vtkjs.js');
const pvwRules = require('./Utilities/rules/paraviewweb.js');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// plugins.push(new BundleAnalyzerPlugin());

module.exports = (env) => {
  if (env && env.release) {
    plugins.push(
      new UglifyJSPlugin({
        uglifyOptions: {
          beautify: false,
          ecma: 6,
          compress: true,
          comments: false,
        },
      })
    );
    plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      })
    );
  }

  return {
    plugins,
    entry,
    output: {
      path: outputPath,
      filename: 'glance.js',
    },
    module: {
      rules: [{ test: entry, loader: 'expose-loader?Glance' }].concat(
        linterRules,
        glanceRules,
        vtkRules,
        pvwRules
      ),
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
};
