import headtrackr from '@jnv/headtrackr'

function facetrackingResult (event = {}) {
  const {x, y, width, height, confidence} = event
  return {x, y, width, height, confidence}
}

export default class HeadCapture extends Phaser.Plugin {
  constructor (game, parent, trackingOptions = {}) {
    super(game, parent)

    // const debug = document.createElement('canvas')
    // debug.className = 'camera-debug-overlay'
    // document.body.appendChild(debug)
    // debug.width = 320
    // debug.height = 240

    const options = {
      ui: false,
      smoothing: false,
      detectionInterval: 20,
      headPosition: true,
      // debug,
      ...trackingOptions,
    }

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

    this.context = null
    this.stream = null

    this.canvas = document.createElement('canvas')
    this.canvas.width = 320
    this.canvas.height = 240

    // document.body.appendChild(this.canvas)

    this.video = document.createElement('video')
    this.video.autoplay = true

    this.tracker = new headtrackr.Tracker(options)
    this.tracker.init(this.video, this.canvas, false)

    this.onConnect = new Phaser.Signal()
    this.onError = new Phaser.Signal()
    this.onTrackingStatus = new Phaser.Signal()
    this.onFaceTracking = new Phaser.Signal()
    this.lastResult = {}

    this.trackingListener = (event) => {
      // console.log(event.status)
      this.onTrackingStatus.dispatch(event.status)
    }

    this.facetrackingListener = (event) => {
      // console.log(event)
      this.onFaceTracking.dispatch(event)
      this.lastResult = event
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

  setup (width, height, context) {
    this.width = width
    this.height = height
    this.context = context
  }

  start () {
    if (!this.width || !this.height || !this.context) {
      throw new Error('Camera was not initialized with setup')
    }

    if (!this.stream) {
      navigator.getUserMedia({
        audio: false,
        video: { mandatory: { minWidth: this.width, minHeight: this.height } } },
        this.connectCallback.bind(this), this.errorCallback.bind(this))
      this.addEventListeners()
      this.tracker.start()
    }
  }

  stop () {
    if (this.stream) {
      this.tracker.stop()
      this.stream.getTracks().forEach(t => t.stop())
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

  grab () {
    if (!this.stream) {
      throw new Error('Stream not available')
    }
    // context.drawImage(this.video, x, y)
    const context = this.canvas.getContext('2d')
    const {x, y, width, height} = this.lastResult

    // x and y are CENTER of object, need to recalculate the crop rect
    const sx = x - width / 2
    const sy = y - height / 2

    const image = context.getImageData(sx, sy, width, height)
    return image
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
