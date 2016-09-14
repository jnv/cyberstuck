import {generateAvatarId} from '../lib/avatar'
import {saveAvatar} from '../lib/storage'
import GameStatus from '../GameStatus'

import StateMachine from '../StateMachine'
import Webcam from '../lib/HeadCapture'
import conf from '../config'
import composeFrames from '../lib/processCapture'
import style from '../style'
import PressButtonText from '../objects/PressButtonText'

const COUNTDOWN_START = 3
const CAPTURE_INTERVAL = 600
const CAPTURE_COUNT = conf.avatar.frames
const TEXTS = {
  start: `To enter the Cyberspace, you will be digitized.

Don't worry, the process is mostly harmless.

Just face the camera and make some faces...
`,
  wait: 'GET READY...',
  noFace: 'FACE THE CAMERA',
  display: `You are now in
the Cyberspace.
Get ready to save StuNoMe.

Good Luck!
`
,
}

const INTRO_FONT_STYLE = {
  ...style.font,
  fontSize: '18px',
  wordWrapWidth: 450,
  wordWrap: true,
}

export default class Camera extends Phaser.State {
  init () {
    const {game} = this

    game.onPause.add(this.onPause, this)
    game.onResume.add(this.onResume, this)

    const sm = StateMachine.create({
      events: [
        {name: 'start', from: 'none', to: 'Start'},
        {name: 'startTracking', from: 'Start', to: 'NoFace'},
        {name: 'faceLost', from: ['NoFace', 'FaceVisible', 'Countdown'], to: 'NoFace'},
        {name: 'faceFound', from: ['NoFace', 'FaceVisible'], to: 'FaceVisible'},
        {name: 'startCountdown', from: 'FaceVisible', to: 'Countdown'},
        {name: 'startCapture', from: 'Countdown', to: 'Capture'},
        {name: 'processCapture', from: 'Capture', to: 'Processing'},
        {name: 'startDisplay', from: 'Processing', to: 'Display'},
        // {name: 'reset', from: 'Display', to: 'NoFace'},
      ],
      callbacks: {
        onStart: () => {
          this.surface.visible = false
          const introText = this.add.text(game.world.centerX, 100, TEXTS.start, INTRO_FONT_STYLE)
          introText.anchor.set(0.5, 0)

          this.camera.start()

          const button = new PressButtonText(game, this, 'digitize')
          button.pressOnce(() => {
            introText.destroy()
            button.destroy()
            sm.startTracking()
          })
        },
        onleaveStart: () => {
          this.surface.visible = true
        },
        onNoFace: () => {
          // set text
          this.overlayText.text = TEXTS.noFace
        },
        onFaceVisible: () => {
          // hide text
          this.overlayText.text = ''
          // move to countdown
          sm.startCountdown()
        },
        onCountdown: () => {
          // start timer
          // FIXME: should have a separate timer to stop onleave
          let countdown = COUNTDOWN_START
          this.overlayText.text = countdown
          game.time.events.repeat(1000, COUNTDOWN_START, () => {
            if (!sm.is('Countdown')) {
              return
            }
            countdown--
            if (countdown === 0) {
              sm.startCapture()
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
              sm.processCapture(captures)
            }
          })
        },
        onProcessing: (event, from, to, frames) => {
          this.camera.stop()
          this.surface.visible = false
          // this.overlayText.text = TEXTS.processing
          this.generateAvatar(frames)
          sm.startDisplay()
        },
        onleaveProcessing: () => {
          this.overlayText.text = ''
        },
        onDisplay: (event, from, to, frames) => {
          const text = this.add.text(game.world.centerX, 100, TEXTS.display, INTRO_FONT_STYLE)
          text.anchor.set(0.5, 0)

          const button = new PressButtonText(game, this, 'continue')
          button.pressOnce(() => {
            this.state.start('MainGame', true, false, this.gameStatus)
          })
        },
      },
    })
    this.sm = sm
  }

  preload () {

  }

  create () {
    // FIXME: add global timeout

    const {game} = this

    this.add.sprite(0, 0, 'bg_base')

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
    this.surface.visible = false

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
    const overlayText = this.add.text(game.world.centerX, game.world.centerY, '', overlayStyle)
    overlayText.anchor.set(0.5)
    this.overlayText = overlayText

    this.gameStatus = null

    this.sm.start()
  }

  shutdown () {
    this.game.plugins.remove(this.camera)
  }

  onPause () {
    console.log('pause')
    this.camera.stop()
  }
  onResume () {
    console.log('resume')
    if (!this.sm.is('Display')) {
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
    const avatarId = generateAvatarId()

    // game.cache.addSpriteSheet('avatar', canvas.toDataURL(), {name: imageName}, conf.avatar.width, conf.avatar.height)
    const dataUrl = canvas.toDataURL()
    game.load.spritesheet('avatar', dataUrl, conf.avatar.width, conf.avatar.height)
    game.load.start()

    const avatar = this.add.sprite(game.world.centerX, game.world.centerY, 'avatar')
    avatar.anchor.setTo(0.5, 0.5)
    avatar.animations.add('default')
    avatar.animations.play('default', 1, true)

    this.avatar = avatar
    this.gameStatus = GameStatus({
      avatar: avatarId,
      avatarData: dataUrl,
    })

    return saveAvatar(avatarId, dataUrl)
  }

  onTrackingStatus (status) {
    if (!this.sm.is('NoFace') && !this.sm.is('Countdown')) {
      return
    }

    try {
      switch (status) {
        case 'found':
          if (this.sm.is('NoFace')) {
            this.sm.faceFound()
          }
          break
        case 'redetecting':
        case 'lost':
        case 'hint':
          if (!this.sm.is('NoFace')) {
            this.sm.faceLost()
          }
          break
        default:
          // console.log(state)
          break
      }
    } catch (e) {
      console.error(e)
    }
  }

  onFaceTracking (e) {
    // console.log(e.x, e.y)
    // apparently we are already tracking the face
    if (this.sm.is('NoFace')) {
      try {
        this.sm.faceFound()
      } catch (e) {
        console.error(e)
      }
    }
  }

  update () {
    // this.camera.update()
    // if (this.camBitmap.visible) {
    //   this.camBitmap.update()
    // }
  }

}

