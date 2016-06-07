const webpack = require('webpack');
const _ = require('lodash');
const bases = require('./webpack.config.js');

const jsBase = bases[0];
const yamlBase = bases[1];

const jsOverrides = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
  ],
};

module.exports = [_.merge(jsBase, jsOverrides), yamlBase];
