const IDLE_TIMEOUT = 60000

export default class DetectIdle extends Phaser.Plugin {
  constructor (game, parent, trackingOptions = {}) {
    super(game, parent)
    this.nudge()

    this.eventListener = () => this.nudge()
    this.wheelEvent = game.device.wheelEvent
    window.addEventListener('keydown', this.eventListener, {capture: false, passive: true})
    window.addEventListener(this.wheelEvent, this.eventListener, {capture: false, passive: true})
    global.IDLE_DETECT = this
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

  onTimeout () {
    console.log('Reached timeout, reloading')
    this.disable()
    window.location.reload(false)
  }

  update () {
    if (Date.now() - this.lastNudge > IDLE_TIMEOUT) {
      this.onTimeout()
    }
  }

  destroy () {
    window.removeEventListener('keydown', this.eventListener)
    window.removeEventListener(this.wheelEvent, this.eventListener)
    global.IDLE_DETECT = null
  }
}
