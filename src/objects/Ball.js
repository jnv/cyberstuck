const OFFSET_Y = 90

export default class Paddle extends Phaser.Sprite {
  static preload (game) {
    game.load.image('ball', 'assets/ball.png')
  }

  constructor (game) {
    super(game, 0, 0, 'ball')

    this.anchor.set(0.5)
    this.checkWorldBounds = true
    this.reset()
    game.add.existing(this)
  }

  enablePhysics () {
    this.game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = true
    this.body.bounce.set(1)
  }

  reset () {
    const {centerX, centerY} = this.game.world
    super.reset(centerX, centerY + OFFSET_Y)
  }

  start () {
    this.body.velocity.y = -300
    this.body.velocity.x = -75
  }

}
