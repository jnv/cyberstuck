const PADDLE_OFFSET = 40
const PADDLE_WIDTH = 84
const PADDLE_HEIGHT = 13

export default class Paddle extends Phaser.Sprite {
  static preload (game) {
    game.load.spritesheet('paddle', 'assets/paddle.png', PADDLE_WIDTH, PADDLE_HEIGHT)
  }

  constructor (game, parent) {
    const x = game.world.centerX
    const y = game.height - PADDLE_OFFSET

    super(game, x, y, 'paddle')

    this.defaultX = x
    this.defaultY = y

    this.anchor.setTo(0.5, 0.5)

    this.animations.add('default')
    this.animations.play('default', 2, true)

    parent.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = true
    this.body.bounce.set(1)
    this.body.immovable = true

    parent.add.existing(this)
  }

  reset () {
    this.x = this.defaultX
    this.y = this.defaultY
  }
}
