import headtrackr from 'headtrackr'

export default class HeadCapture extends Phaser.Plugin {
  constructor (game, parent, trackingOptions = {}) {
    super(game, parent)

    const options = {
      ui: false,
      smoothing: true,
      detectionInterval: 100,
      headPosition: true,
      ...trackingOptions,
    }

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

    this.context = null
    this.stream = null

    this.canvas = document.createElement('canvas')

    this.video = document.createElement('video')
    this.video.autoplay = true

    this.tracker = new headtrackr.Tracker(options)
    this.tracker.init(this.video, this.canvas, false)

    this.onConnect = new Phaser.Signal()
    this.onError = new Phaser.Signal()
    this.onTrackingStatus = new Phaser.Signal()
    this.onFaceTracking = new Phaser.Signal()

    this.trackingListener = (event) => {
      // console.log(event.status)
      this.onTrackingStatus.dispatch(event.status)
    }

    this.facetrackingListener = (event) => {
      // console.log(event)
      this.onFaceTracking.dispatch(event)
    }
  }

  addEventListeners () {
    document.addEventListener('headtrackrStatus', this.trackingListener)
    document.addEventListener('facetrackingEvent', this.facetrackingListener)
  }

  removeEventListeners () {
    document.removeEventListener('headtrackrStatus', this.trackingListener)
    document.removeEventListener('facetrackingEvent', this.facetrackingListener)
  }

  start (width, height, context) {
    this.context = context

    if (!this.stream) {
      navigator.getUserMedia({ video: { mandatory: { minWidth: width, minHeight: height } } }, this.connectCallback.bind(this), this.errorCallback.bind(this))
      this.addEventListeners()
      this.tracker.start()
    }
  }

  stop () {
    if (this.stream) {
      this.tracker.stop()
      this.stream.stop()
      this.removeEventListeners()
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
