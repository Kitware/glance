const autoprefixer = require('autoprefixer');
const variables = require('postcss-variables');
const style = require('../themes/default.js');

module.exports = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [{ loader: 'babel-loader', options: { presets: ['env', 'react'] } }],
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
          plugins: () => [
            variables(style),
            autoprefixer('last 3 version', 'ie >= 10'),
          ],
        },
      },
    ],
  },
  {
    test: /\.css$/,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-loader' },
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => [autoprefixer('last 3 version', 'ie >= 10')],
        },
      },
    ],
  },
  {
    test: /\.(png|jpg|svg)$/,
    use: 'url-loader?limit=600000',
  },
];
