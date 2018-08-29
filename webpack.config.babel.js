/* eslint import/no-extraneous-dependencies: [error, {devDependencies: true}] */

const path = require('path');

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
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve('src'),
        loader: 'eslint-loader',
        enforce: 'pre',
        options: {
          emitWarning: !isProduction,
        },
      },
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.jsx$/,
        include: path.resolve('src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
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

module.exports = js;
