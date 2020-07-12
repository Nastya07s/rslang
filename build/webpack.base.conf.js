const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  audiocall: path.join(__dirname, '../src/minigames/audio-call'),
  assets: 'assets',
};

module.exports = {
  externals: {
    paths: PATHS,
  },
  resolve: {
    alias: {
      app: PATHS.src,
      audiocall: PATHS.audiocall,
    },
    extensions: ['.js'],
  },
  entry: {
    main: `${PATHS.src}/js/main.js`,
    audiocall: `${PATHS.audiocall}/audiocall.js`,
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
    // new HtmlWebpackPlugin({
    //   template: `${PATHS.src}/index.html`,
    //   filename: './index.html',
    //   chunks: ['main'],
    // }),
    new HtmlWebpackPlugin({
      template: `${PATHS.src}/index.html`,
      filename: './index.html',
      // to exclude mini-games' chunks & prevent running their code in the main app '/'
      excludeChunks: ['audiocall'],
    }),
    new HtmlWebpackPlugin({
      template: `${PATHS.audiocall}/index.html`,
      filename: './audiocall/index.html',
      inject: true, // if true - to insert link & script tags into html
      chunks: ['audiocall', 'vendors', 'app'], // include exact this chunk of needed code
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
