const PADDLE_OFFSET = 40
const PADDLE_WIDTH = 100
const PADDLE_HEIGHT = 15
export default function Paddle (game) {
  let sprite

  const paddle = {
    y: game.height - PADDLE_OFFSET,

    preload () {
      game.load.spritesheet('paddle', 'assets/paddle.png', PADDLE_WIDTH, PADDLE_HEIGHT)
    },
    create () {
      sprite = game.add.sprite(game.world.centerX, paddle.y, 'paddle')

      sprite.anchor.setTo(0.5, 0.5)
      sprite.animations.add('default')
      sprite.animations.play('default', 2, true)

      game.physics.enable(sprite, Phaser.Physics.ARCADE)
      sprite.body.collideWorldBounds = true
      sprite.body.bounce.set(1)
      sprite.body.immovable = true
    },
    update () {

    },
    kill () {

    },
  }

  return paddle
}
