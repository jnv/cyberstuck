import '../lib/Webcam'
import conf from '../config'

export default class Camera extends Phaser.State {
  preload () {

  }

  create () {
    const {game} = this
    const camera = new Phaser.Plugin.Webcam(game, this)
    this.camera = camera

    const camBitmap = this.add.bitmapData(conf.camera.width, conf.camera.height)
    this.camBitmap = camBitmap

    const pixelBitmap = this.add.bitmapData(game.width, game.height)
    this.pixelBitmap = pixelBitmap

    camera.onConnect.add(this.onCameraConnect, this)
    camera.onError.add(this.onCameraError, this)
    camera.start(camBitmap.width, camBitmap.height, this.camBitmap.context)
    this.add.plugin(camera)

    this.surface = this.add.sprite(0, 0, camBitmap)
  }

  onCameraConnect (e) {
    console.log(e)
  }

  onCameraError (e) {
    console.error(e)
  }

  update () {
    // this.camera.update()
    this.camBitmap.update()
  }

}

