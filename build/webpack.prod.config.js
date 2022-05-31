const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { mergeWithRules } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');

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

const merge = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      exclude: 'match',
      use: 'replace',
    },
  },
});

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

module.exports = merge(baseConfig, {
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
                localIdentName: '[folder]-[local]-[hash:base64:5]',
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
    chunkIds: 'total-size',
    moduleIds: 'size',
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        // avoids optimizing ITK files
        exclude: [/itk\//],
      }),
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'static/redirect-app.html',
        },
      ]
    }),
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
