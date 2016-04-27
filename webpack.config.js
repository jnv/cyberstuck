var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path')

var config = {
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[hash].js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
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
    }],
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
