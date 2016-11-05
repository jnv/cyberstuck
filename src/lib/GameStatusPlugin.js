import GameStatus from '../GameStatus'

export default class GameStatusPlugin extends Phaser.Plugin {
  constructor (game, parent) {
    super(game, parent)

    game.status = this

    this.reset()
  }

  reset (overrides) {
    console.log('GameStatus reset')
    this.status = GameStatus(overrides)
  }

  won () {
    this.status.won = true
  }

  modifyLives (amount = 0) {
    this.status.lives += amount
  }

  modifyScore (amount = 0) {
    this.status.score += amount
  }

  setAvatar (avatarId, avatarData = '') {
    this.status.avatar = avatarId
    this.status.avatarData = avatarData
  }
}
