import headtrackr from '@jnv/headtrackr'

const CANVAS_WIDTH = 320
const CANVAS_HEIGHT = 240

/**
 * Calculate correct origin point and size value for a given center point, size and maximum size.
 * For example, center is: 230 (y), size 60 (height) and maxSize 240 (CANVAS_HEIGHT);
 * origin is calculated as 200 (230 - 60 / 2),
 * size is calculated as 40 (since 260 would overlap the canvas)
 */
function clampCrop (center, size, maxSize) {
  const origin = center - size / 2
  const endPoint = origin + size
  let realSize = size
  if (endPoint < 0 || endPoint > maxSize) {
    const delta = Math.abs(endPoint - maxSize)
    realSize -= delta
  }

  return {origin, size: realSize}
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
    this.canvas.width = CANVAS_WIDTH
    this.canvas.height = CANVAS_HEIGHT

    // document.body.appendChild(this.canvas)

    this.video = document.createElement('video')
    this.video.autoplay = true

    this.tracker = new headtrackr.Tracker(options)
    this.tracker.init(this.video, this.canvas, false)

    this.onConnect = new Phaser.Signal()
    this.onError = new Phaser.Signal()
    this.onTrackingStatus = new Phaser.Signal()
    this.onFaceTracking = new Phaser.Signal()
    // by default set to the center + full canvas
    this.lastResult = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    }

    this.trackingListener = (event) => {
      this.onTrackingStatus.dispatch(event.status)
    }

    this.facetrackingListener = (event) => {
      this.onFaceTracking.dispatch(event)

      // Rather keep an old result than to insert invalid value
      if (event.width > 0 && event.height > 0) {
        this.lastResult = event
      }
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
    const clampX = clampCrop(x, width, CANVAS_WIDTH)
    const clampY = clampCrop(y, height, CANVAS_HEIGHT)

    const image = context.getImageData(clampX.origin, clampY.origin, clampX.size, clampY.size)
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
