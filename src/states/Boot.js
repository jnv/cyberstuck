import PhaserDebug from 'phaser-debug'

export default class Boot extends Phaser.State {
  preload () {
    this.load.image('bg_base', 'assets/bg.png')
    this.load.image('avatar', 'assets/avatar-default.png')
  }

  create () {
    // Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)

    const {game, scale} = this
    //scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    //scale.pageAlignHorizontally = true
    //scale.pageAlignVertically = true

    game.time.desiredFps = 30

    if (process.env.NODE_ENV === 'development') {
      //game.plugins.add(PhaserDebug)
    }

    game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN,
      Phaser.Keyboard.SPACEBAR,
    ])

    this.state.start('Title')
  }
}
