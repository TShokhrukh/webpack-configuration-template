const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const IS_DEV = process.env.NODE_ENV === 'development'
const IS_PROD = process.env.NODE_ENV === 'production'

/** @type {import('webpack').Configuration} */
const configuration = {
  target: 'web',
  entry: path.resolve(__dirname, 'src/index.ts'),
  mode: process.env.NODE_ENV,
  devtool: IS_DEV ? 'eval-source-map' : false,
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: /\.((s[ac]ss)|(css))$/,
        use: [
          IS_DEV ? 'style-loader' : { loader: MiniCssExtractPlugin.loader, options: {} },
          'css-loader'
          // 'postcss-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.json'],
    plugins: [
      new TsconfigPathsPlugin()
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].[contenthash].bundle.js',
    chunkFilename: IS_DEV ? 'js/[name].[contenthash].chunk.js' : 'js/[contenthash].chunk.js',
    assetModuleFilename: 'asset/[name].[hash][ext]'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: './public/index.html',
      hash: IS_DEV,
      cache: true,
      options: {
        THEME_COLOR: '#000',
        TITLE: 'Document',
        PUBLIC_PATH: '/',
        NOSCRIPT_TEXT: 'You need to enable JavaScript to run this app.'
      },
      minify: IS_PROD
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
          }
        : undefined
    }),
    new ForkTsCheckerWebpackPlugin(),
    new Dotenv(),
    new ESLintPlugin({
      extensions: ['.ts', '.tsx'],
      cache: true
    }),
    IS_PROD
      ? new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
        chunkFilename: 'css/[name].[hash].chunk.css'
      })
      : false,
    new CleanWebpackPlugin()
  ].filter(Boolean),
  optimization: {
    minimize: IS_PROD,
    minimizer: [
      new TerserPlugin()
    ],
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`
    },
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'build')
    },
    watchFiles: path.join(__dirname, 'src'),
    port: 9000,
    liveReload: true
  }
}

module.exports = configuration
