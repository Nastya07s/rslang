const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  sprint: path.join(__dirname, '../src/minigames/sprint/index-sprint.js'),
  assets: 'assets',
};

module.exports = {
  externals: {
    paths: PATHS,
  },
  resolve: {
    alias: {
      app: PATHS.src,
    },
    extensions: ['.js'],
  },
  entry: {
    main: `${PATHS.src}/js/main.js`,
    sprint: PATHS.sprint,
  },
  output: {
    filename: `${PATHS.assets}/js/[name].[hash].js`,
    path: PATHS.dist,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [
        /(node_modules|dist|public)/,
      ],
      use: ['babel-loader', 'eslint-loader'],
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
    }, {
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      },
    }, {
      test: /\.(wav|mp3)$/i,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      },
    }],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}/css/[name].[contenthash].css`,
    }),
    new HtmlWebpackPlugin({
      template: `${PATHS.src}/index.html`,
      filename: './index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: `${PATHS.src}/minigames/sprint/index.html`,
      filename: './sprint.html',
      chunks: ['sprint'],
    }),
    new CopyWebpackPlugin([
      {
        from: `${PATHS.src}/img`,
        to: `${PATHS.assets}/img`,
      },
      {
        from: `${PATHS.src}/audio`,
        to: `${PATHS.assets}/audio`,
      },
      {
        from: `${PATHS.src}/static`,
        to: '',
      },
    ]),
  ],
};
