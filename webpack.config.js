module.exports = {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    './src/app.jsx',
  ],
  output: {
    publicPath: 'assets',
    path: 'assets',
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  plugins: [
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
        },
      },
    ],
  },
};
