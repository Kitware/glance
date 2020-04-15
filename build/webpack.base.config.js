const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const autoprefixer = require('autoprefixer');
const vtkRules = require('vtk.js/Utilities/config/dependency').webpack;

const externals = require('./externals.js');

const paths = {
  entry: path.join(__dirname, '../src/app.js'),
  source: path.join(__dirname, '../src'),
  externals: path.join(__dirname, '../externals'),
  output: path.join(__dirname, '../dist'),
  root: path.join(__dirname, '..'),
  node_modules: path.join(__dirname, '../node_modules'),
};

module.exports = {
  entry: Object.assign({
    glance: paths.entry,
  }, externals.getExternalEntries(paths.externals)),
  output: {
    path: paths.output,
    filename: '[name].[contenthash].js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: paths.entry,
        loader: 'expose-loader?Glance',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|svg|ttf|woff2?|eot|otf)$/,
        loader: 'url-loader',
        options: {
          // Make sure this is just big enough to load one font file
          limit: 300000,
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [], // prod/dev fills in the loaders
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        include: /node_modules/,
        // prod/dev fills in the last loader
        use: ['css-loader'],
      },
      {
        test: /\.pug$/,
        loader: "pug-plain-loader",
      },
      {
        test: /\.s[ca]ss$/,
        // prod/dev fills in the last loader
        use: [
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
      },
      /* for vtk.js styles */
      {
        test: /\.module\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]-[local]-[sha512:hash:base32:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer('last 3 version', 'ie >= 10')],
            },
          },
        ],
      },
    ].concat(vtkRules.core.rules),
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!version.js'],
    }),
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
    new WriteFilePlugin(),
    new CopyPlugin([
      {
        from: path.join(
          paths.node_modules,
          'workbox-sw',
          'build',
          'importScripts',
          'workbox-sw.prod.*.js'
        ),
        flatten: true,
      },
      {
        from: path.join(paths.node_modules, 'itk'),
        to: 'itk',
      },
      {
        from: path.join(paths.root, 'static'),
      },
      {
        from: path.join(paths.root, 'itk', 'web-build', 'itkfiltering*'),
        to: path.join('itk', 'Pipelines'),
        flatten: true,
      },
    ]),
    new GenerateSW({
      cacheId: 'paraview-glance-',
      cleanupOutdatedCaches: true,
      include: [/\.js$/],
      exclude: ['serviceWorker.js'],
      swDest: path.join(paths.output, 'serviceWorker.js'),
      skipWaiting: true,
      runtimeCaching: [
        {
          handler: 'CacheFirst',
          urlPattern: /(\.css|\.ttf|\.eot|\.woff|\.js|\.png|\.svg|\.wasm)$/,
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      'paraview-glance': paths.root,
      'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps.json': path.join(paths.source, 'config/ColorMaps.json'),
    },
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
          chunks: 'all',
        },
      },
    },
  },
};
