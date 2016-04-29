var config = require('./webpack.config')

var webpack = require('webpack')

var plugins = [
  // just disable warnings for compressor
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false,
    },
  }),
]
Array.prototype.push.apply(config.plugins, plugins)

module.exports = config
