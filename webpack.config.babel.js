import fs from 'fs';
import yaml from 'js-yaml';

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
        test: /index\.yml$/, // To make loader selection happy, use yml instead of yaml
        loader: 'json!yaml',
      },
    ],
  },
};

const dataFiles = yaml.safeLoad(fs.readFileSync('./data/index.yml'));
const yamlEntries = {};
dataFiles.forEach(f => {
  yamlEntries[f.name] = `./data/${f.name}.yaml`;
});
const yaml2jsonfile = {
  entry: yamlEntries,
  output: {
    publicPath: 'assets/',
    path: 'assets/',
    filename: '[name].json.js',
  },
  module: {
    loaders: [
      {
        test: /\.yaml$/,
        loader: 'yaml',
      },
    ],
  },
};

const statColor = {
  entry: { color: './data/dummy_stat_color.dummy' },
  output: {
    publicPath: 'assets/',
    path: 'assets/',
    filename: 'stat-[name].json.js',
  },
  module: {
    loaders: [
      {
        test: /\.dummy$/,
        loader: 'sw-stat-color',
      },
    ],
  },
};

export default [js, yaml2jsonfile, statColor];
