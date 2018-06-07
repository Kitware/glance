const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
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
  entry: Object.assign({
    glance: paths.entry,
  }, externals.getExternalEntries(paths.externals)),
  output: {
    path: paths.output,
    filename: '[name].js',
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
          limit: 60000,
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[folder]-[local]-[sha512:hash:base32:5]',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
      },
      /* for vtk.js */
      {
        test: /\.glsl$/,
        include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
        loader: 'shader-loader',
      },
      {
        test: /\.svg$/,
        include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
        loader: 'raw-loader',
      },
      {
        test: /\.worker\.js$/,
        include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
        use: [
          {
            loader: 'worker-loader',
            options: { inline: true, fallback: false },
          },
        ],
      },
      {
        test: /\.mcss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              localIdentName: '[name]-[local]-[sha512:hash:base32:5]',
              modules: true,
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
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyPlugin([
      {
        from: path.join(
          __dirname,
          'node_modules',
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
    ]),
    new WorkboxPlugin({
      globIgnores: ['serviceWorker.js'],
      swSrc: path.join(paths.externals, 'Workbox', 'serviceWorker.js'),
      swDest: path.join(paths.output, 'serviceWorker.js'),
    }),
  ],
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      'paraview-glance': paths.root,
    },
  },
};
