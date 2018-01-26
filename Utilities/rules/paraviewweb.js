module.exports = [
  {
    test: /\.js$/,
    include: /node_modules(\/|\\)paraviewweb(\/|\\)/,
    use: [{ loader: 'babel-loader', options: { presets: ['env', 'react'] } }],
  },
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [
      {
        loader: 'url-loader',
        options: { limit: 600000, mimetype: 'application/font-woff' },
      },
    ],
  },
  {
    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [{ loader: 'url-loader', options: { limit: 600000 } }],
    include: /fonts/,
  },
];
