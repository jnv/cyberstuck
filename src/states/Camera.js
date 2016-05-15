import StateMachine from 'state-machine'
import Webcam from '../lib/HeadCapture'
import conf from '../config'
import composeFrames from '../lib/processCapture'
import style from '../style'

// const States = new Enum(['noFace', 'faceReady', 'countdown', 'recording', 'display'], { freez: true })

const COUNTDOWN_START = 3
const CAPTURE_INTERVAL = 600
const CAPTURE_COUNT = conf.avatar.frames
const TEXTS = {
  wait: 'GET READY...',
  noFace: 'FACE THE CAMERA',
  processing: 'PROCESSING...',
}

export default class Camera extends Phaser.State {
  init () {
    const {game} = this

    game.onPause.add(this.onPause, this)
    game.onResume.add(this.onResume, this)

    const state = StateMachine.create({
      events: [
        {name: 'start', from: 'none', to: 'Start'},
        {name: 'faceLost', from: ['Start', 'NoFace', 'FaceVisible', 'Countdown'], to: 'NoFace'},
        {name: 'faceFound', from: ['NoFace', 'FaceVisible'], to: 'FaceVisible'},
        {name: 'startCountdown', from: 'FaceVisible', to: 'Countdown'},
        {name: 'startCapture', from: 'Countdown', to: 'Capture'},
        {name: 'processCapture', from: 'Capture', to: 'Processing'},
        {name: 'startDisplay', from: 'Processing', to: 'Display'},
        // {name: 'reset', from: 'Display', to: 'NoFace'},
      ],
      callbacks: {
        onStart: () => {
          this.camBitmap.visible = true
          this.camBitmap.alpha = 1
          this.camera.start()
          state.faceLost()
        },
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
            if (!state.is('Countdown')) {
              return
            }
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
              state.processCapture(captures)
            }
          })
        },
        onProcessing: (event, from, to, frames) => {
          this.camera.stop()
          this.camBitmap.visible = false
          this.camBitmap.clear()
          // this.overlayText.text = TEXTS.processing
          this.generateAvatar(frames)
          state.startDisplay()
        },
        onleaveProcessing: () => {
          this.overlayText.text = ''
        },
        onDisplay: (event, from, to, frames) => {
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
    camera.setup(camBitmap.width, camBitmap.height, camBitmap.context)
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
      ...style.font,
      stroke: '#000',
      strokeThickness: 3,
    }
    const overlayText = this.add.text(game.world.centerX, game.world.centerY, TEXTS.wait, overlayStyle)
    overlayText.anchor.set(0.5)
    this.overlayText = overlayText

    this.state.start()
  }

  onPause () {
    console.log('pause')
    this.camera.stop()
  }
  onResume () {
    console.log('resume')
    if (!this.stateis('Display')) {
      this.camera.start()
    }
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

  generateAvatar (frames) {
    const canvas = composeFrames(frames)
    const {game} = this
    game.load.spritesheet('avatar', canvas.toDataURL(), conf.avatar.width, conf.avatar.height)
    game.load.start()

    const avatar = this.add.sprite(game.world.centerX, game.world.centerY, 'avatar')
    avatar.anchor.setTo(0.5, 0.5)
    avatar.animations.add('default')
    avatar.animations.play('default', 1, true)

    this.avatar = avatar
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
    // if (this.camBitmap.visible) {
    //   this.camBitmap.update()
    // }
  }

}

