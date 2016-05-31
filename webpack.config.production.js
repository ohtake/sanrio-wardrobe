const webpack = require('webpack');
const _ = require('lodash');
const base = require('./webpack.config.js');

const overrides = {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
             },
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
    ],
};

module.exports = _.merge(base, overrides);
