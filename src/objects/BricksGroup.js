import Brick from './Brick'

const BRICK_WIDTH = 34
const BRICK_HEIGHT = 16

export default class BricksGroup extends Phaser.Group {
  static preload(game) {
    Brick.preload(game)
  }

  constructor(game, parent, x, y) {
    super(game)
    this.x = x
    this.y = y
    this.classType = Brick

    this.enableBody = true
    this.physicsBodyType = Phaser.Physics.ARCADE

    parent.add.existing(this)
  }

  addBricks(levelSpec = [[]]) {
    for (let i = levelSpec.length - 1; i >= 0; i--) {
      const row = levelSpec[i]
      const y = BRICK_HEIGHT * i

      for (let j = row.length - 1; j >= 0; j--) {
        const cell = row[j]
        const x = BRICK_WIDTH * j

        if (!cell) {
          continue
        }

        const brick = this.create(x, y, cell)
        brick.enablePhysics()
      }
    }
  }
}
