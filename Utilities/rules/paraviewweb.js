module.exports = [
  {
    test: /\.js$/,
    include: /node_modules(\/|\\)paraviewweb(\/|\\)/,
    use: [
      { loader: 'babel-loader', options: { presets: ['es2015', 'react'] } },
    ],
  },
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [
      { loader: 'url-loader', options: { limit: 60000, mimetype: 'application/font-woff' } },
    ],
  },
  {
    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [
      { loader: 'url-loader', options: { limit: 60000 } },
    ],
    include: /fonts/,
  },
];
