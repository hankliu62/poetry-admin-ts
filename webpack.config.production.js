const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// webpack 配置文档
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const LessPluginFunctions = require('less-plugin-functions');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/index') // 主网站入口
  },
  mode: 'production',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    extensions: ['.tsx', '.ts', '.js', '.css', '.less'],
    alias: {
      '~': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          'awesome-typescript-loader'
        ]
      },
      {
        test: /\.(css|less)$/,
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                plugins: [new LessPluginFunctions()]
              }
            }
          }
        ]
      },
      {
        test: /\.(woff|eot|ttf|svg)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10,
              name: 'static/fonts/[name]_[contenthash].[ext]'
            }
          }
        ]
      },
      {
        // 图片加载处理
        test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'static')],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1,
              name: 'static/images/[name]_[contenthash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader'
          },
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: false, // 去除warning警告
            // drop_debugger: true,// 发布时去除debugger语句
            // drop_console: true, // 发布时去除console语句
            pure_funcs: ['console.log'], // 配置发布时，不被打包的函数，只去掉console.log,
          }
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        // 出现多次的js包单独打包成common.js
        commons: {
          name: 'common',
          priority: 10, // 优先级
          // test: /react|mobx|antd|moment/,
          test: /node_modules/,
          chunks: 'initial',
          // minSize: 0, // 默认小于30kb不会打包
          minChunks: 2 // 引用1次就要打包出来
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CaseSensitivePathsPlugin(),
    new HtmlWebpackPlugin({
      hash: false,
      template: path.resolve(__dirname, 'src', 'template.html'),
      filename: 'index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'static'),
          to: path.resolve(__dirname, 'dist', 'static'),
          toType: 'dir'
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: `[name].[contenthash].css`
    }),
  ]
};
