var webpack = require('webpack')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

// Via https://github.com/photonstorm/phaser#webpack-config
var phaserModule = path.join(__dirname, '/node_modules/phaser/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

var NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development')

var config = {
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[hash].js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /(node_modules|bower_components)/,
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
    }, {
      test: /\.json$/,
      loader: 'json',
    }, {
      test: /\.woff$|\.ttf$|\.wav$|\.mp3$/,
      loader: 'file',
    }, {
      test: /\.jpe?g$|\.gif$|\.png$|\.svg$/,
      loaders: [
        'url?limit=8192&hash=sha512&digest=hex&name=[hash].[ext]',
        'image?bypassOnDebug&optimizationLevel=7&interlaced=false',
      ],
    },
    { test: /phaser-split\.js$/, loader: 'imports?PIXI=pixi.js&p2' },
    ],
  },
  resolve: {
    alias: {
      // Required by phaser
      'phaser': phaser,
      'pixi.js': pixi,
      'p2': p2,
      'phaser-debug': path.join(__dirname, '/node_modules/phaser-debug/dist/phaser-debug.js'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index_template.html',
      inject: 'body', // Inject all scripts into the body
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': NODE_ENV,
      },
    }),
    new webpack.ProvidePlugin({
      Phaser: 'phaser',
    }),
    new ExtractTextPlugin('styles.css', {
      allChunks: true,
    }),
  ],
  // devtool: 'eval',
  devtool: 'sourcemap',
}

module.exports = config
