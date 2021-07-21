const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

const ROOT_PREFIX = 'WebWorkerPromise';
const MODULE_PREFIX = 'webworker-promise';

const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);
const generateLibrary = name => ({
  root: `${ROOT_PREFIX}${name ? capitalizeFirstLetter(name) : ''}`,
  amd: `webworker-promise${name ? '-' + name : ''}`,
  commonjs: `webworker-promise${name ? '-' + name : ''}`
});

const defaultConfig = {
  target: 'web',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
};

const main = {
  ...defaultConfig,
  entry: { worker: './src/index'},

  output: {
    ...defaultConfig.output,
    library: generateLibrary()
  }
};


const pool = {
  ...defaultConfig,
  entry: {pool: './src/pool'},
  output: {
    ...defaultConfig.output,
    library: generateLibrary('pool')
  }
};

const worker = {
  ...defaultConfig,
  target: 'webworker',
  entry: {register: './src/register'},
  output: {
    ...defaultConfig.output,
    library: generateLibrary('register')
  }
};

const minify = (conf) => {
  return {
    ...conf,
    output: {
      ...conf.output,
      filename: '[name].min.js'
    },
    plugins: [new UglifyJsPlugin()]
  };
};


module.exports = [main, pool, worker, minify(main), minify(pool), minify(worker)];