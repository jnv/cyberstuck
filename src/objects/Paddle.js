const PADDLE_OFFSET = 40
const PADDLE_WIDTH = 84
const PADDLE_HEIGHT = 13

const ACCEL = 275
const DRAG = 500
const MAX_VELOCITY = 200

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
    this.body.bounce.set(0)
    this.body.immovable = true

    this.minX = 0
    this.maxX = this.width

    this.body.drag.x = DRAG
    // this.body.maxVelocity.x = MAX_VELOCITY

    parent.add.existing(this)
  }

  reset () {
    this.x = this.defaultX
    this.y = this.defaultY
    this.resetMovement()
  }

  moveLeft () {
    this.body.velocity.x = -ACCEL
  }

  moveRight () {
    this.body.velocity.x = +ACCEL
  }

  resetMovement () {
    const {velocity} = this.body
    velocity.x = 0
  }

  setBoundaries (minX, maxX) {
    // account for anchor
    const halfWidth = this.width / 2
    this.minX = minX + halfWidth
    this.maxX = maxX - halfWidth
  }

  adjustToBoundaries () {
    if (this.x < this.minX) {
      this.x = this.minX
    } else if (this.x > this.maxX) {
      this.x = this.maxX
    }
  }
}
