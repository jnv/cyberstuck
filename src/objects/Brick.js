import random from 'lodash/random'

export default class Paddle extends Phaser.Sprite {
  static preload(game) {
    game.load.image('brick', 'assets/brick.png')
  }

  constructor(game, x, y) {
    super(game, x, y, 'brick')

    this.health = 1
    game.add.existing(this)
  }

  enablePhysics() {
    this.body.bounce.set(1)
    this.body.immovable = true
    this.body.moves = false
    this.body.mass = 5
  }

  hasBonus() {
    const r = random(0, 10)

    return r < 3
  }
}
