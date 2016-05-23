import './index.css'
import WebFont from 'webfontloader'
import Phaser from 'phaser'

const game = new Phaser.Game(480, 640,
  Phaser.CANVAS, // renderer
  'game-container', // parent DOM ID
  null, // initial state
  false, // transparent
  false // antialias
)

const states = ['Boot', 'Title', 'Intro', 'Camera', 'MainGame', 'GameOver', 'Win']
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
