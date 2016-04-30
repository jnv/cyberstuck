import './index.css'
import Phaser from 'phaser'

const game = new Phaser.Game(480, 640,
  Phaser.AUTO, // renderer
  'game-container', // parent DOM ID
  null, // initial state
  false, // transparent
  false // antialias
)

const states = ['Boot', 'Title', 'MainGame']
states.forEach(state => {
  game.state.add(state, require(`./states/${state}`).default)
})

game.state.start('MainGame')
