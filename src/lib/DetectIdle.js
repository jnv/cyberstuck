import track from '../track'

const IDLE_TIMEOUT = 60000

export default class DetectIdle extends Phaser.Plugin {
  constructor (game, parent, trackingOptions = {}) {
    super(game, parent)
    this.nudge()

    this.eventListener = () => this.nudge()
    this.wheelEvent = game.device.wheelEvent
    window.addEventListener('keydown', this.eventListener, {capture: false, passive: true})
    window.addEventListener(this.wheelEvent, this.eventListener, {capture: false, passive: true})
    game.detectIdle = this
    this.onTimeout = new Phaser.Signal()

    this.onTimeout.addOnce(this.onTimeoutHandler, this)
  }

  disable () {
    console.log('DetectIdle disabled')
    this.active = false
  }

  enable () {
    console.log('DetectIdle enabled')
    this.active = true
  }

  nudge () {
    this.lastNudge = Date.now()
  }

  onTimeoutHandler () {
    track.event({
      category: 'DetectIdle',
      action: 'onTimeout',
      label: this.game.screenName(),
      value: this.game.status.score,
      nonInteraction: true,
      sessionControl: 'end',
    })
    console.info('Reached timeout, reloading', this.game.status.all)
    this.disable()
    track.onReady(() => {
      window.location.reload(false)
    })
  }

  update () {
    if (Date.now() - this.lastNudge > IDLE_TIMEOUT) {
      this.onTimeout()
    }
  }

  destroy () {
    window.removeEventListener('keydown', this.eventListener)
    window.removeEventListener(this.wheelEvent, this.eventListener)
    game.detectIdle = null
    super.destroy()
  }
}
