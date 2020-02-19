// Apparently there is a circular dependency on Phaser in PIXI

module.exports = {
  Canvas: {
    getSmoothingPrefix: function(context) {
      var vendor = ['i', 'webkitI', 'msI', 'mozI', 'oI']

      for (var prefix in vendor) {
        var s = vendor[prefix] + 'mageSmoothingEnabled'

        if (s in context) {
          return s
        }
      }
      return null
    },
  },
}
