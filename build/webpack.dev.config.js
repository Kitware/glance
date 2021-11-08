const HtmlWebpackPlugin = require('html-webpack-plugin');
const { mergeWithRules } = require('webpack-merge');

const baseConfig = require('./webpack.base.config');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const merge = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      exclude: 'match',
      use: 'replace',
    },
  },
});

module.exports = merge(baseConfig, {
  mode: 'development',
  // devtool: 'inline-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[folder]-[local]-[hash:base64:5]',
              },
            },
          },
        ],
      },
      {
        test: /\.s[ca]ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    static: {
      directory: baseConfig.output.path,
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    host: HOST || '0.0.0.0',
    port: PORT || 9999,
    allowedHosts: 'all',
    hot: false,
    devMiddleware: {
      stats: {
        colors: true,
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'static/index.html',
      inject: false,
    }),
  ],
});