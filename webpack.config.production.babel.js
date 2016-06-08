import webpack from 'webpack';
import _ from 'lodash';
import bases from './webpack.config.babel.js';

const jsBase = bases[0];
const yamlBase = bases[1];

const jsOverrides = {
  plugins: [
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
  ],
};

export default [_.merge(jsBase, jsOverrides), yamlBase];
