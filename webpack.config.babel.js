import path from 'path';
import webpack from 'webpack';

const isProduction = process.env.NODE_ENV === 'production';

const js = {
  entry: [
    './src/index.jsx',
  ],
  output: {
    publicPath: 'assets/',
    path: 'assets/',
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  plugins: [
    ...(isProduction ? [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
    ] : []),
  ],
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        include: path.resolve('src'),
        loader: 'eslint',
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.jsx$/,
        include: path.resolve('src'),
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
        },
      },
      {
        test: /\.yaml$/,
        include: path.resolve('data'),
        loader: 'yaml',
      },
    ],
  },
};

export default js;
