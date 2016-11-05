import WebFont from 'webfontloader'

window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')

global.IS_DEV = require('electron-is-dev')

const game = new Phaser.Game(480, 640,
  Phaser.CANVAS, // renderer
  '', // parent DOM ID
  null, // initial state
  false, // transparent
  false // antialias
)

const states = ['Boot', 'Title', 'Intro', 'Camera', 'MainGame', 'GameOver', 'HiScore', 'HiScoreEnter', 'Finish', 'Demo']
states.forEach(state => {
  game.state.add(state, require(`./states/${state}`).default)
})

WebFont.load({
  custom: {
    families: ['PressStart2P'],
  },
  timeout: 5000,
  active: () => game.state.start('Boot'),
})
