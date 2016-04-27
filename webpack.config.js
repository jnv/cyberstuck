var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path')

// Via https://github.com/photonstorm/phaser#webpack-config
var phaserModule = path.join(__dirname, '/node_modules/phaser/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

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
      loader: 'style!css',
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
    }, {
      // Required by phaser
      test: /pixi.js/,
      loader: 'script',
    },
    ],
  },
  resolve: {
    alias: {
      // Required by phaser
      'phaser': phaser,
      'pixi.js': pixi,
      'p2': p2,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index_template.html',
      inject: 'body', // Inject all scripts into the body
    }),
  ],
  // devtool: 'eval',
  devtool: 'sourcemap',
  devServer: {
    hot: true,
    inline: true,
    lazy: false,
  },
}

module.exports = config