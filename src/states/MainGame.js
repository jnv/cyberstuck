import PhaserDebug from 'phaser-debug'
import colors from '../colors'
import Paddle from '../objects/Paddle'
import BrickFactory from '../objects/BrickFactory'

const FRAME_INNER_BORDER = 18
const CANVAS_BORDER = 20
const BRICK_WIDTH = 42
const BRICK_HEIGHT = 20

const FONT_STYLE = {
  font: '20px PressStart2P',
  fill: '#fff',
}

const TITLE_STYLE = {
  ...FONT_STYLE,
  boundsAlignV: 'top',
  boundsAlignH: 'right',
  fill: colors.red,
}

const SCORE_STYLE = {
  ...FONT_STYLE,
  boundsAlignV: 'bottom',
  boundsAlignH: 'right',
}

export default class MainGame extends Phaser.State {
  init (status = null) {
    this.gameStatus = {}
    this.objects = {
      paddle: Paddle(this.game),
    }
  }

  preload () {
    this.load.image('background', 'assets/bg1.png')
    this.load.image('frame', 'assets/frame.png')
    this.objects.paddle.preload()
    this.load.image('ball', 'assets/ball.png')
  }

  create () {
    const {game, objects} = this

    game.plugins.add(PhaserDebug)

    game.physics.startSystem(Phaser.Physics.ARCADE)
    // game.physics.arcade.checkCollision.down = false

    // BACKGROUND AND FRAME
    this.add.sprite(0, 0, 'background')

    const frameImg = game.cache.getImage('frame')
    const frameHeight = frameImg.height
    const frameWidth = frameImg.width
    const frameY = game.height - frameHeight
    this.add.sprite(0, frameY, 'frame')

    // WORLD BOUNDS - derived from frame
    const worldBounds = [
      0 + FRAME_INNER_BORDER, // X
      frameY + FRAME_INNER_BORDER, // Y
      frameWidth - (2 * FRAME_INNER_BORDER), // width
      frameHeight - FRAME_INNER_BORDER, // height; just a single border!
    ]
    // we are setting world bounds to be smaller than camera
    // source: http://www.html5gamedevs.com/topic/8048-gameworldsetbounds-doesnt-work/#comment-48042
    game.camera.bounds.setTo(0, 0, game.width, game.height)
    game.world.bounds.setTo(...worldBounds)
    game.physics.setBoundsToWorld()

    // SCORE
    const scoreBounds = [
      0, // X
      CANVAS_BORDER, // Y
      game.width - CANVAS_BORDER, // Width
      54, // HEIGHT
    ]
    const scoreTitle = this.add.text(0, 0, 'SCORE', TITLE_STYLE)
    scoreTitle.setTextBounds(...scoreBounds)

    const score = this.add.text(0, 0, '0', SCORE_STYLE)
    score.setTextBounds(...scoreBounds)

    objects.score = score


    // BRICKS
    // objects.bricks.add(200, 150)
    const bricks = game.add.group()
    bricks.enableBody = true
    bricks.physicsBodyType = Phaser.Physics.ARCADE

    const brickFill = game.add.bitmapData(BRICK_WIDTH, BRICK_HEIGHT)
    brickFill.ctx.beginPath()
    brickFill.ctx.rect(0, 0, BRICK_WIDTH, BRICK_HEIGHT)
    brickFill.ctx.fillStyle = '#ffffff'
    brickFill.ctx.fill()

    const boundsTopY = worldBounds[1]
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 10; x++) {
        const brick = bricks.create(
          2 + FRAME_INNER_BORDER + (x * BRICK_WIDTH) + x * 2,
          BRICK_HEIGHT + boundsTopY + (y * BRICK_HEIGHT * 2),
          brickFill)
        brick.body.bounce.set(1)
        brick.body.immovable = true
      }
    }

    // PADDLE
    objects.paddle.create()

    // BALL
    const ball = game.add.sprite(game.world.centerX, objects.paddle.y - 16, 'ball')
    ball.anchor.set(0.5)
    ball.checkWorldBounds = true
    game.physics.enable(ball, Phaser.Physics.ARCADE)
    ball.body.collideWorldBounds = true
    ball.body.bounce.set(1)

    ball.events.onOutOfBounds.add(this.onBallLost, this)
    ball.body.velocity.set(150, -150)
  }

  createBricks () {

  }

  onBallLost () {
    console.log('ball lost')
  }

  update () {
    const {game, objects} = this

    //game.physics.arcade.collide(objects.ball, objects.paddle)

  }
}

