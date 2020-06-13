const merge = require('webpack-merge');

const baseWebpackConfig = require('./webpack.base.conf');

const buildWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    publicPath: 'https://nastya07s.github.io/quizBurger/',
  },
  plugins: [],
});

module.exports = new Promise((resolve/* , reject */) => {
  resolve(buildWebpackConfig);
});

// module.exports = buildWebpackConfig;
