const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATH = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  sprint: path.join(__dirname, '../src/minigames/sprint/index-sprint.js'),
  assets: 'assets',
};

module.exports = {

  externals: {
    paths: PATH,
  },
  entry: {
    app: PATH.src,
    sprint: PATH.sprint,
  },
  output: {
    filename: `${PATH.assets}/js/[name].[hash].js`,
    path: PATH.dist,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel-loader', 'eslint-loader'],
      exclude: '/node_modules/',
    }, {
      test: /\.(png|jpg|gif|svg|webp)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      },
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true },
        },
        {
          loader: 'postcss-loader',
          options: { sourceMap: true, config: { path: './build/postcss.config.js' } },
        },
        {
          loader: 'sass-loader',
          options: { sourceMap: true },
        },
      ],
    }],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATH.assets}/css/[name].[contenthash].css`,
    }),
    new HtmlWebpackPlugin({
      template: `${PATH.src}/index.html`,
      filename: './index.html',
    }),
    new HtmlWebpackPlugin({
      template: `${PATH.src}/minigames/sprint/index.html`,
      filename: './sprint.html',
      chunks: ['sprint'],
    }),
    new CopyWebpackPlugin([{
      from: `${PATH.src}/img`,
      to: `${PATH.assets}/img`,
    },
    {
      from: `${PATH.src}/static`,
      to: '',
    },
    ]),
  ],
};
