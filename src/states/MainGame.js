import PhaserDebug from 'phaser-debug'
import GameStatus from '../GameStatus'
import Avatar from '../entities/Avatar'

const FONT_STYLE = {
  font: '32px PressStart2P',
  fill: '#fff',
  stroke: '#333',
  strokeThickness: 1,
}

export default class MainGame extends Phaser.State {
  init (gameStatus = null) {

  }

  preload () {
    this.load.image('background', 'assets/bg1.png')
  }

  create () {
    const {game} = this

    game.plugins.add(PhaserDebug)

    game.physics.startSystem(Phaser.Physics.ARCADE)

    // Add sprites
    this.add.sprite(0, 0, 'background')

    this.add.text(120, 20, 'Lorem Ipsum', FONT_STYLE)
  }

  update () {

  }
}

