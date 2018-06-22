const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.base.config');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

module.exports = merge(baseConfig, {
  mode: 'development',
  // devtool: 'inline-cheap-module-source-map',
  devServer: {
    contentBase: baseConfig.output.path,
    host: HOST || '0.0.0.0',
    port: PORT || 9999,
    disableHostCheck: true,
    hot: false,
    quiet: false,
    noInfo: false,
    stats: {
      colors: true,
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
