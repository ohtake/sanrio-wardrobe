import DataFile from './src/data_file.js';

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
    ],
  },
};

const yamlEntries = {};
DataFile.all.forEach(f => {
  yamlEntries[f.name] = `./data/${f.name}.yaml`;
});
const yaml = {
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

export default [js, yaml];
