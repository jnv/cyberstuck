import {loadHiscore} from '../lib/hiscore'
import DetectIdle from '../lib/DetectIdle'

export default class Boot extends Phaser.State {
  preload () {
    loadHiscore()
    this.load.image('bg_base', 'assets/bg.png')
    this.load.image('avatar', 'assets/avatar-default.png')
    this.load.image('avatar-default', 'assets/avatar-default.png')
    this.load.image('down', 'assets/down.png')
  }

  create () {
    // Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)
    const {game, scale} = this
    // scale.pageAlignVertically = true
    scale.pageAlignHorizontally = true

    game.time.desiredFps = 30

    /*
    scale.maxWidth = 480
    scale.maxHeight = 640
    */
    scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

    /*
    game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN,
      Phaser.Keyboard.SPACEBAR,
    ])
    */

    game.add.plugin(new DetectIdle(game))

    this.state.start('Title')
  }
}
