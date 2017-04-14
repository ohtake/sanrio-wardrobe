/* eslint import/no-extraneous-dependencies: [error, {devDependencies: true}] */

import path from 'path';
import webpack from 'webpack';

const isProduction = process.env.NODE_ENV === 'production';

const js = {
  entry: [
    './src/index.jsx',
  ],
  output: {
    publicPath: 'assets/',
    path: path.resolve('assets'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
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
        sourceMap: true,
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
    ] : []),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve('src'),
        loader: 'eslint-loader',
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
          },
        },
      },
      {
        test: /\.jsx$/,
        include: path.resolve('src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015'],
            plugins: [
              ...(isProduction ? [
                'transform-react-remove-prop-types',
              ] : []),
            ],
          },
        },
      },
      {
        test: /\.yaml$/,
        include: path.resolve('data'),
        use: {
          loader: 'yaml-loader',
        },
      },
    ],
  },
};

export default js;
