const BRICK_WIDTH = 42
const BRICK_HEIGHT = 20

export default function BrickFactory (game) {
  const bricks = game.add.group()
  bricks.enableBody = true
  bricks.physicsBodyType = Phaser.Physics.ARCADE

  const brickFill = game.add.bitmapData(BRICK_WIDTH, BRICK_HEIGHT)
  brickFill.ctx.beginPath()
  brickFill.ctx.rect(0, 0, BRICK_WIDTH, BRICK_HEIGHT)
  brickFill.ctx.fillStyle = '#ff0000'
  brickFill.ctx.fill()

  return {
    preload () {

    },

    add (x, y) {
      const brick = bricks.create(x, y, 'paddle')
      brick.body.bounce.set(1)
      brick.body.immovable = true
      game.debug.spriteInfo(brick)
    },
  }
}
