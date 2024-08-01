const { mergeWithRules } = require('webpack-merge');

const prodConfig = require('./webpack.prod.config');

const merge = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      type: 'replace',
    },
  },
});


module.exports = merge(prodConfig, {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|svg|ttf|woff2?|eot|otf)$/,
        type: 'asset/inline',
      },
    ],
  },
});
