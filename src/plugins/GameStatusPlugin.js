import GameStatus from '../GameStatus'
import track from '../track'

export default class GameStatusPlugin extends Phaser.Plugin {
  constructor (game, parent) {
    super(game, parent)

    game.status = this

    this.reset()
  }

  newPlayer () {
    this.reset()
    track.setUser(this.status.id)
  }

  reset (overrides) {
    console.log('GameStatus reset')
    this.status = GameStatus(overrides)
  }

  get all () {
    return this.status
  }

  get lives () {
    return this.status.lives
  }

  get level () {
    return this.status.level
  }

  get won () {
    return this.status.won
  }

  get score () {
    return this.status.score
  }

  setWon () {
    this.status.won = true
  }

  nextLevel () {
    this.status.level += 1
    return this.status.level
  }

  modifyLives (amount = 0) {
    this.status.lives += amount
    return this.status.lives
  }

  modifyScore (amount = 0) {
    this.status.score += amount
  }

  setAvatar ({avatar, avatarData}) {
    this.status.avatar = avatar
    this.status.avatarData = avatarData
  }

  setInitials (initials) {
    this.status.initials = initials
  }
}
