import track from '../lib/track'

const IGNORED_STATES = ['Boot', 'Title', 'HiScore', 'Demo']

export default class StateTracking extends Phaser.Plugin {
  constructor(game, parent) {
    super(game, parent)
    game.screenName = this.screenName.bind(this)
    game.state.onStateChange.add(this.onStateChange, this)
  }

  screenName(state = null) {
    const {game} = this

    if (!state) {
      state = game.state.current
    }

    if (state === 'MainGame' && game.status) {
      const level = game.status.level
      return `Level_${level}`
    }

    return state
  }

  onStateChange(newState, oldState) {
    if (IGNORED_STATES.includes(newState)) {
      return
    }

    const name = this.screenName(newState)

    let sessionControl = null

    if (name === 'Intro') {
      sessionControl = 'start'
    }

    if (name === 'Finish') {
      sessionControl = 'end'
    }

    track.screen(name, {sessionControl})
  }

  destroy() {
    this.game.state.onStateChange.remove(this.onStateChange, this)
    this.game.screenName = null
    super.destroy()
  }
}
