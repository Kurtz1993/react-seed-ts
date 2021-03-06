const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const server = require('webpack-dev-server');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const cwd = process.cwd();

module.exports = {
  cache: true,
  context: cwd,
  performance: {
    hints: false
  },
  entry: {
    app: [
      path.resolve(cwd, 'src/index.tsx')
    ]
  },
  output: {
    chunkFilename: '[name].chunk.js',
    filename: '[name].js',
    path: path.resolve(cwd, 'dist'),
    publicPath: '/dist/',
    sourceMapFilename: '[name].map'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'tslint-loader',
          options: {
            configFile: path.resolve(cwd, 'tslint.json'),
            tsConfigFile: '../tsconfig.json',
            typeCheck: true
          }
        }],
        enforce: 'pre'
      },
      {
        test: /\.tsx?$/,
        include: path.join(process.cwd(), 'src'),
        loader: 'awesome-typescript-loader'
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?name=fonts/[hash].[ext]'
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader?name=fonts/[hash].[ext]&limit=5000'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?name=fonts/[hash].[ext]&limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?name=fonts/[hash].[ext]&limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.(jpe?g|png)$/,
        loader: 'url-loader?name=images/[hash].[ext]&limit=500'
      },
      {
        test: /(\.css)$/,
        loader: ExtractTextPlugin.extract({
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [autoprefixer];
                }
              }
            }
          ]
        })
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [autoprefixer];
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: process.env.NODE_ENV == 'production' ?
                  'compressed' :
                  'normal'
              }
            }
          ]
        })
      }
    ]
  },
  node: {
    fs: 'empty',
    global: true,
    crypto: 'empty'
  },
  plugins: [
    new ProgressBarPlugin({
      format: chalk.magenta.bold('Building') + ' [' + chalk.green(':bar') + '] ' + chalk.green.bold(':percent') + ' ' + chalk.yellow.bold(':elapsed seconds') + ' ' + chalk.white(':msg'),
      clear: false
    }),
    new ExtractTextPlugin({
      filename: '[name].css'
    })
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    modules: [
      path.resolve(cwd, 'src'),
      path.resolve(cwd, 'node_modules')
    ]
  }
};