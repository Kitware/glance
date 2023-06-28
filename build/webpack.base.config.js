const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const autoprefixer = require('autoprefixer');

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
  entry: Object.assign(
    {
      glance: paths.entry,
    },
    externals.getExternalEntries(paths.externals)
  ),
  output: {
    path: paths.output,
    filename: '[name].[contenthash].js',
    libraryTarget: 'umd',
    publicPath: '',
  },
  module: {
    rules: [
      {
        test: paths.entry,
        loader: 'expose-loader',
        options: {
          exposes: ['Glance'],
        },
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
        type: 'asset/resource',
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
        loader: 'pug-plain-loader',
      },
      {
        test: /\.s[ca]ss$/,
        // prod/dev fills in the last loader
        use: ['css-loader', 'sass-loader'],
      },
      {
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
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
                localIdentName: '[name]-[local]-[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!version.js'],
    }),
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
    new WriteFilePlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(paths.node_modules, 'itk'),
          to: 'itk',
        },
        {
          // globs use forward slashes
          from: `${paths.root.replace(/\\/g, '/')}/itk/web-build/itkfiltering*`,
          to: path.join('itk', 'Pipelines', '[name][ext]'),
        },
        { from: 'static/ParaView.png' },
      ],
    }),
    new GenerateSW({
      cacheId: 'paraview-glance-2-',
      cleanupOutdatedCaches: true,
      include: [/\.js$/],
      exclude: ['serviceWorker.js'],
      swDest: path.join(paths.output, 'serviceWorker.js'),
      skipWaiting: true,
      runtimeCaching: [
        {
          handler: 'NetworkFirst',
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
      '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps.json':
        path.join(paths.source, 'config/ColorMaps.json'),
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
