import PhaserDebug from 'phaser-debug'

export default class Boot extends Phaser.State {
  preload () {

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


    this.state.start('Title')
  }
}
