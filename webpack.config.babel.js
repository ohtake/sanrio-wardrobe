const js = {
  entry: [
    './src/app.jsx',
  ],
  output: {
    publicPath: 'assets/',
    path: 'assets/',
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  plugins: [
  ],
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint',
      },
    ],
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
      {
        test: /\.yaml$/,
        loader: 'yaml',
      },
    ],
  },
};

export default [js];
