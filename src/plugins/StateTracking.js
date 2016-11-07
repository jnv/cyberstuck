import track from '../track'

const IGNORED_STATES = ['Boot', 'Title', 'HiScore', 'Demo']

export default class StateTracking extends Phaser.Plugin {
  constructor (game, parent) {
    super(game, parent)
    game.state.onStateChange.add(this.onStateChange, this)
  }

  onStateChange (newState, oldState) {
    const {game} = this

    if (IGNORED_STATES.includes(newState)) {
      return
    }

    let name = newState

    if (newState === 'MainGame') {
      const level = game.status.level
      name = `Level_${level}`
    }

    track.screen(name)
  }

  destroy () {
    this.game.state.onStateChange.remove(this.onStateChange, this)
    super.destroy()
  }
}
