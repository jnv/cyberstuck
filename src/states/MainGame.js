import PhaserDebug from 'phaser-debug'

export default class MainGame extends Phaser.State {
  preload () {

  }

  create () {
    this.game.plugins.add(PhaserDebug)
  }
}

