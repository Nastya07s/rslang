const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  output: {
    publicPath: '/',
  },
  // devtool: '#cheap-eval-source-map',
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    port: 8081,
    // contentBase: baseWebpackConfig.externals.paths.dist,
    // overlay: true,
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ],
});

module.exports = new Promise((resolve/* , reject */) => {
  resolve(devWebpackConfig);
});

// module.exports = devWebpackConfig;
