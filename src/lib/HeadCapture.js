export default class HeadCapture extends Phaser.Plugin {
  constructor (game, parent) {
    super(game, parent)

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

    this.context = null
    this.stream = null

    this.video = document.createElement('video')
    this.video.autoplay = true

    this.onConnect = new Phaser.Signal()
    this.onError = new Phaser.Signal()
  }

  start (width, height, context) {
    this.context = context

    if (!this.stream) {
      navigator.getUserMedia({ video: { mandatory: { minWidth: width, minHeight: height } } }, this.connectCallback.bind(this), this.errorCallback.bind(this))
    }
  }

  stop () {
    if (this.stream) {
      this.stream.stop()
      this.stream = null
    }
  }

  connectCallback (stream) {
    this.stream = stream

    this.video.src = window.URL.createObjectURL(this.stream)

    this.onConnect.dispatch(this.video)
  }

  errorCallback (event) {
    this.onError.dispatch(event)
  }

  grab (context, x, y) {
    if (this.stream) {
      context.drawImage(this.video, x, y)
    }
  }

  update () {
    if (this.stream) {
      this.context.drawImage(this.video, 0, 0)
    }
  }

  get active () {
    return !!this.stream
  }
}
