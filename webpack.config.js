const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const helpersPath = path.join(__dirname, 'Utilities', 'helpers');
const externals = require(path.join(helpersPath, 'externals.js'));

const plugins = [];
const entry = path.join(__dirname, './Sources/index.js');
const sourcePath = path.join(__dirname, './Sources');
const outputPath = path.join(__dirname, './Distribution');
const externalPath = path.join(sourcePath, 'externals');

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

  plugins.push(
    new CopyPlugin([
      {
        from: path.join(__dirname, 'node_modules', 'workbox-sw',
                  'build', 'importScripts', 'workbox-sw.prod.*.js'),
        flatten: true,
      }
    ])
  );

  // workbox plugin should be last plugin
  plugins.push(
    new WorkboxPlugin({
      globDirectory: outputPath,
      globPatterns: ['**/*.{html,js,png,svg}'],
      globIgnores: [
        'serviceWorker.js',
      ],
      swSrc: path.join(sourcePath, 'externals', 'Workbox', 'serviceWorker.js'),
      swDest: path.join(outputPath, 'serviceWorker.js'),
    })
  );

  return {
    plugins,
    entry: Object.assign(
      {
        glance: entry,
      },
      externals.getExternalEntries(externalPath)
    ),
    output: {
      path: outputPath,
      filename: '[name].js',
      libraryTarget: 'umd',
    },
    module: {
      rules: [{ test: entry, loader: 'expose-loader?Glance' }].concat(
        externals.getExternalExposeRules(externalPath),
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
