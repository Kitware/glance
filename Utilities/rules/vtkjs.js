const autoprefixer = require('autoprefixer');

module.exports = [
  {
    test: /\.glsl$/i,
    include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
    loader: 'shader-loader',
  },
  {
    test: /\.js$/,
    include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
    use: [
      { loader: 'babel-loader', options: { presets: ['es2015'] } },
    ],
  },
  {
    test: /\.mcss$/,
    include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-loader', options: { localIdentName: '[sha512:hash:base32:5]-[name]-[local]', modules: true } },
      { loader: 'postcss-loader', options: { plugins: () => [autoprefixer('last 3 version', 'ie >= 10')] } },
    ],
  },
  {
    test: /\.svg$/,
    include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
    use: [
      { loader: 'raw-loader' },
    ],
  },
];
