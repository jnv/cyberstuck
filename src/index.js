const Phaser = require('phaser')

const game = new Phaser.Game(480, 640,
  Phaser.AUTO, // renderer
  'game-container', // parent DOM ID
  null, // initial state
  false, // transparent
  false // antialias
)
