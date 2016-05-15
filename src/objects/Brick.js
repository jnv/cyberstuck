export default class Paddle extends Phaser.Sprite {
  static preload (game) {
    game.load.image('brick', 'assets/brick.png')
  }

  constructor (game, x, y) {
    super(game, x, y, 'brick')

    this.health = 1
    game.add.existing(this)
  }

  enablePhysics () {
    this.enableBody = true
    this.physicsBodyType = Phaser.Physics.ARCADE
  }

}
