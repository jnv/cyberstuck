export default class Boot extends Phaser.State {
  preload () {

  }

  create () {
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)

    const {scale} = this
    //scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    //scale.pageAlignHorizontally = true
    //scale.pageAlignVertically = true

    this.state.start('Title')
  }
}
