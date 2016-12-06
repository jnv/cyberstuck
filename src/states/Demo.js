let DEMO_ITER = 0
const FILES_COUNT = 3
const VIDEO_KEY = 'demoVideo'

function demoFileName (number) {
  return `assets/demo/${number}.ogv`
}

export default class Demo extends Phaser.State {
  init (options) {
    global.IDLE_DETECT.disable()

    DEMO_ITER = (DEMO_ITER + 1) % FILES_COUNT

    this.options = {
      nextState: 'Title',
      pressTextThunk: null,
      ...options,
    }
  }

  preload () {
    this.load.video(VIDEO_KEY, demoFileName(DEMO_ITER))
  }

  create () {
    const {game, options} = this


    const video = game.add.video(VIDEO_KEY)
    video.addToWorld(game.world.centerX, game.world.centerY, 0.5, 0.5)
    video.play()
    video.onComplete.addOnce(this.onComplete, this)
    this.video = video

    if (options.pressTextThunk) {
      options.pressTextThunk(game, this)
    }
  }

  onComplete () {
    this.state.start(this.options.nextState, true, false)
  }

  shutdown () {
    this.video.onComplete.remove(this.onComplete)
    this.video.stop()
    this.video = null
    this.cache.removeVideo(VIDEO_KEY)
    global.IDLE_DETECT.enable()
  }
}

