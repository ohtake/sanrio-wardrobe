const webpack = require('webpack');
const _ = require('lodash');
const base = require('./webpack.config.js');

const overrides = {
  // In production, libs following are not bundled. Browsers load libs from CDN (see index.html) and use them.
  // In development, libs are loaded from both bundle (with debug info) and CDN (without debug info). Libs in bundle are used because of scoping.
  // Though it is inefficient to load both in development mode, there is no drawbacks in production mode.
  // Be sure that versions match in package.json and index.html.
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
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

module.exports = _.merge(base, overrides);
