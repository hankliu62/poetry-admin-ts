const path = require('path');
const internalIp = require('internal-ip');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// webpack 配置文档
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LessPluginFunctions = require('less-plugin-functions');

const devServer = {
  host: internalIp.v4.sync(),
  port: 8081,
  hot: true,
  compress: true,
  historyApiFallback: true, // using html5 router.
  proxy: {}
}

module.exports = {
  entry: [
    'webpack-dev-server/client?http://' + devServer.host + ':' + devServer.port, //  为webpack-dev-server的环境打包好运行代码
    'webpack/hot/only-dev-server', // 为热替换（HMR）打包好运行代码,//  only- 意味着只有成功更新运行代码才会执行热替换（HMR）
    path.resolve(__dirname, 'src/index.ts')
  ],
  mode: 'development',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  devServer,
  devtool: 'source-map',
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
        enforce: 'pre',
        test: /\.tsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          'source-map-loader'
        ]
      },
      {
        test: /\.(css|less)$/,
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')],
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
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
        test: /\.(png|jpg|jpeg|gif|ico|svg|webp)$/,
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
            loader: 'image-webpack-loader',
          },
        ]
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
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
    })
  ]
};
