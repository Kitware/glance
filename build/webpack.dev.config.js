const merge = require('webpack-merge');

const baseConfig = require('./webpack.base.config');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

module.exports = merge.multiple(baseConfig, {
  main: {
    mode: 'development',
    devServer: {
      contentBase: baseConfig.main.output.path,
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
  },
});
