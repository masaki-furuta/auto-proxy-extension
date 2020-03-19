const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  devtool: 'cheap-module-source-map',
  context: path.resolve(__dirname, './src'),
  entry: {
    options: './options/index.js',
    popup: './popup/index.js',
    background: './background/index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '.',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.styl(us)?$/,
        use: ['style-loader', 'css-loader', 'stylus-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js',
      bulma$: 'bulma/css/bulma.css',
    },
    extensions: ['.js'],
  },
  plugins: [
    new CleanWebpackPlugin({ paths: ['./dist/', './dist-zip/'] }),
    new CopyWebpackPlugin([
      { from: 'assets', to: 'assets' },
      { from: 'manifest.json', to: 'manifest.json', flatten: true },
    ]),
    new HtmlWebpackPlugin({
      title: 'Options',
      template: './index.html',
      inject: true,
      chunks: ['manifest', 'vendor', 'options'],
      filename: 'options.html',
    }),
    new HtmlWebpackPlugin({
      title: 'Popup',
      template: './index.html',
      inject: true,
      chunks: ['manifest', 'vendor', 'popup'],
      filename: 'popup.html',
    }),
    new VueLoaderPlugin(),
    {
      apply: compiler => {
        // eslint-disable-next-line
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', compilation => {
          // exec('node "./scripts/remove-evals.js"', (err, stdout, stderr) => {
          //   if (stdout) process.stdout.write(stdout)
          //   if (stderr) process.stderr.write(stderr)
          // })
        })
      },
    },
  ],
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
  ])
} else {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.HotModuleReplacementPlugin(),
    new ChromeExtensionReloader({
      entries: {
        background: 'background',
        options: 'options',
        popup: 'popup',
      },
    }),
  ])
}
