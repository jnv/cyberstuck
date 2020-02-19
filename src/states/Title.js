import PressButtonText from '../objects/PressButtonText'
import style from '../style'

const SUBTITLE_STYLE = {
  ...style.font,
  fontSize: '16px',
}

const TITLE_TIMEOUT = 7000
const START_LIMIT = 500
let START_COUNT = 0

export default class Title extends Phaser.State {
  init() {
    this.game.detectIdle.disable()
  }

  preload() {
    this.load.image('logo', 'assets/logo.png')
    this.load.image('bg_title', 'assets/bg_title.png')
  }

  create() {
    START_COUNT++
    // XXX handle slow memory leak (?),
    //     periodically refresh page
    if (START_COUNT > START_LIMIT) {
      console.info(
        `Reached START_COUNT ${START_COUNT} > ${START_LIMIT}, refreshing`
      )
      this.state.start('Finish')
      return
    }

    const {game} = this
    // this.add.sprite(0, 0, 'bg_base')
    this.add.sprite(0, 0, 'bg_title')

    this.add.sprite(0, 0, 'logo')

    const subtitle = this.add.text(
      game.world.centerX - 10,
      400,
      'LOST IN THE NEW MEDIA',
      SUBTITLE_STYLE
    )
    subtitle.anchor.set(0.5, 0)

    this.pressButtonText = new PressButtonText(game, this, 'start')

    this.input.keyboard.addCallbacks(
      this,
      undefined,
      undefined,
      this.onKeyPress
    )
    this.time.events.add(TITLE_TIMEOUT, this.nextIdleState, this)
  }

  onKeyPress(char, event) {
    switch (char) {
      // XXX: debugging
      case 'g':
        this.state.start('MainGame')
        break
      case 'c':
        this.state.start('Camera')
        break
      case ' ': // XXX: this should be handled by button...
        this.state.start('Intro')
        break
    }
  }

  nextIdleState() {
    const {game} = this
    const thunk = PressButtonText.thunk('start', function() {
      game.state.start('Intro')
    })

    const nextStateNum = START_COUNT % 2
    let nextState = 'Demo'
    if (nextStateNum === 1) {
      nextState = 'HiScore'
    }

    this.state.start(nextState, true, false, {
      timeout: 10000,
      nextState: 'Title',
      pressTextThunk: thunk,
    })
  }

  shutdown() {
    this.pressButtonText = null
    this.game.detectIdle.enable()
  }
}
