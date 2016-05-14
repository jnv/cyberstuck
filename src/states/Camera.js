import StateMachine from 'state-machine'
import Webcam from '../lib/HeadCapture'
import conf from '../config'
import processCapture from '../lib/processCapture'
import style from '../style'

// const States = new Enum(['noFace', 'faceReady', 'countdown', 'recording', 'display'], { freez: true })

const COUNTDOWN_START = 5
const CAPTURE_INTERVAL = 1000
const CAPTURE_COUNT = conf.avatar.frames
const TEXTS = {
  wait: 'GET READY...',
  noFace: 'FACE THE CAMERA',
}

export default class Camera extends Phaser.State {
  init () {
    const {game} = this

    game.onPause.add(this.onPause, this)
    game.onResume.add(this.onResume, this)

    const state = StateMachine.create({
      events: [
        {name: 'start', from: 'none', to: 'NoFace'},
        {name: 'faceFound', from: ['NoFace', 'FaceVisible'], to: 'FaceVisible'},
        {name: 'faceLost', from: ['NoFace', 'FaceVisible', 'Countdown'], to: 'NoFace'},
        {name: 'startCountdown', from: 'FaceVisible', to: 'Countdown'},
        {name: 'startCapture', from: 'Countdown', to: 'Capture'},
        {name: 'startDisplay', from: 'Capture', to: 'Display'},
        // {name: 'reset', from: 'Display', to: 'NoFace'},
      ],
      callbacks: {
        onNoFace: () => {
          // set text
          this.overlayText.text = TEXTS.noFace
        },
        onFaceVisible: () => {
          // hide text
          this.overlayText.text = ''
          // move to countdown
          state.startCountdown()
        },
        onCountdown: () => {
          // start timer
          // FIXME: should have a separate timer to stop onleave
          let countdown = COUNTDOWN_START
          this.overlayText.text = countdown
          game.time.events.repeat(1000, COUNTDOWN_START, () => {
            countdown--
            if (countdown === 0) {
              state.startCapture()
            } else {
              this.overlayText.text = countdown
            }
          })
        },
        onleaveCountdown: () => {
          this.overlayText.text = ''
        },
        onCapture: () => {
          // start timer & capturing
          const captures = []
          let count = CAPTURE_COUNT - 1
          captures.push(this.captureFrame())
          game.time.events.repeat(CAPTURE_INTERVAL, count, () => {
            count--
            captures.push(this.captureFrame())
            if (count === 0) {
              state.startDisplay(captures)
            }
          })
        },
        onDisplay: (event, from, to, frames) => {
          this.generateSprite(frames)
        },
      },
    })
    this.state = state
  }

  preload () {

  }

  create () {
    const {game} = this
    const camera = new Webcam(game, this)
    this.camera = camera

    const camBitmap = this.add.bitmapData(conf.camera.width, conf.camera.height)
    this.camBitmap = camBitmap

    camera.onConnect.add(this.onCameraConnect, this)
    camera.onError.add(this.onCameraError, this)
    camera.onFaceTracking.add(this.onFaceTracking, this)
    camera.onTrackingStatus.add(this.onTrackingStatus, this)
    camera.setup(camBitmap.width, camBitmap.height, this.camBitmap.context)
    this.add.plugin(camera)

    this.surface = this.add.sprite(0, 140, camBitmap)
    this.surface.scale.setTo(0.75)

    const shutter = this.add.graphics(0, 0)
    shutter.beginFill(0xffffff, 1)
    shutter.drawRect(0, 0, game.width, game.height)
    shutter.endFill()
    shutter.alpha = 0
    this.shutter = shutter

    const overlayStyle = {
      ...style.text,
      stroke: '#000',
      strokeThickness: 3,
    }
    const overlayText = this.add.text(game.world.centerX, game.world.centerY, TEXTS.wait, overlayStyle)
    overlayText.anchor.set(0.5)
    this.overlayText = overlayText

    this.state.start()
    this.camera.start()
  }

  onPause () {
    console.log('pause')
    this.camera.stop()
  }
  onResume () {
    console.log('resume')
    this.camera.start()
  }

  onCameraConnect (e) {
    // console.log(e)
  }

  onCameraError (e) {
    console.error(e)
  }

  captureFrame () {
    const {shutter} = this

    shutter.alpha = 1
    this.add.tween(shutter)
            .to({alpha: 0}, CAPTURE_INTERVAL / 3, Phaser.Easing.Cubic.Out, true)

    return this.camera.grab()
  }

  generateSprite (frames) {
    const imgData = frames.map(processCapture)
    console.log(imgData)
  }

  onTrackingStatus (state) {
    console.log(state)
    console.log(this.state.current)
    if (!this.state.is('NoFace') && !this.state.is('Countdown')) {
      return
    }

    switch (state) {
      case 'found':
        if (this.state.is('NoFace')) {
          this.state.faceFound()
        }
        break
      case 'redetecting':
      case 'lost':
      case 'hint':
        if (!this.state.is('NoFace')) {
          this.state.faceLost()
        }
        break
      default:
        // console.log(state)
        break
    }
  }

  onFaceTracking (e) {
    // console.log(e.x, e.y)
    // // apparently we are already tracking the face
    // if (this.state.is('NoFace')) {
    //   try {
    //     this.state.faceFound()
    //   } catch (e) {

    //   }
    // }
  }

  update () {
    // this.camera.update()
    this.camBitmap.update()
  }

}

