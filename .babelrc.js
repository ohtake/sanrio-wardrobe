const config = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/proposal-object-rest-spread',
  ],
  env: {
    test: {
      plugins: [
        'istanbul',
      ],
    },
  },
};

module.exports = config;
