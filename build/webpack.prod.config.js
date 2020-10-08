const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.base.config');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const htmlMinifyOptions = {
  collapseWhitespace: false,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
};

function htmlTemplateParameters({ useGA = false } = { useGA: false }) {
  return (compilation, assets, assetTags, options) => ({
    compilation,
    webpackConfig: compilation.options,
    htmlWebpackPlugin: {
      tags: assetTags,
      files: assets,
      options,
    },
    googleAnalytics: useGA,
  });
}

module.exports = merge.smart(baseConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[folder]-[local]-[sha512:hash:base32:5]',
              },
            },
          },
        ],
      },
      {
        test: /\.s[ca]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        include: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  optimization: {
    occurrenceOrder: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'static/index.html',
      inject: false,
      templateParameters: htmlTemplateParameters({ useGA: false }),
      minify: htmlMinifyOptions,
    }),
    new HtmlWebpackPlugin({
      filename: 'index-ga.html',
      template: 'static/index.html',
      inject: false,
      templateParameters: htmlTemplateParameters({ useGA: true }),
      minify: htmlMinifyOptions,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      ignoreOrder: false,
    }),
  ],
});
