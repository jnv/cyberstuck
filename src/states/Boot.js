import {getHiscore} from '../lib/hiscore'
import * as avatar from '../lib/avatar'
import DetectIdle from '../lib/DetectIdle'
import GameStatusPlugin from '../lib/GameStatusPlugin'
import StateTracking from '../plugins/StateTracking'

export default class Boot extends Phaser.State {
  init () {
    this.loaded = false
  }

  preload () {
    this.load.image('bg_base', 'assets/bg.png')
    this.load.image('avatar', 'assets/avatars/default.png')
    this.load.image('down', 'assets/down.png')
    const defaultAvatars = avatar.preloadDefaultAvatars(this)
    getHiscore(20)
      .then(hiscore => avatar.preloadDataUrls(this, hiscore))
      .then(hiscoreKeys => {
        this.game.AvatarPool = avatar.AvatarPool(hiscoreKeys, defaultAvatars)
      })
      .then(() => {
        // XXX: synchronization: since this is an async part,
        // preload() may finish earlier than we get the avatars ready.
        // So to be on safe side we force load one more time and check if
        // everything has been loaded in create()
        this.load.start()
        this.loaded = true
      })
  }

  create () {
    // Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)
    const {game, scale} = this
    // scale.pageAlignVertically = true
    scale.pageAlignHorizontally = true

    game.time.desiredFps = 30

    /*
    scale.maxWidth = 480
    scale.maxHeight = 640
    */
    scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

    /*
    game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN,
      Phaser.Keyboard.SPACEBAR,
    ])
    */

    game.add.plugin(new DetectIdle(game))
    game.add.plugin(new GameStatusPlugin(game))
    game.add.plugin(new StateTracking(game))

    const waitForLoaded = () => {
      if (!this.loaded || !this.load.hasLoaded) {
        console.info('Throttling loading')
        window.setTimeout(waitForLoaded, 50)
      } else {
        this.state.start('Title')
      }
    }
    waitForLoaded()
  }
}
