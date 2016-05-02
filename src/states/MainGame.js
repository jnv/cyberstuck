import PhaserDebug from 'phaser-debug'
import colors from '../colors'
import Paddle from '../objects/Paddle'
// import BrickFactory from '../objects/BrickFactory'

const FRAME_INNER_BORDER = 18
const CANVAS_BORDER = 20
const BRICK_WIDTH = 42
const BRICK_HEIGHT = 20
const AVATAR_WIDTH = 64

const KEYS_MAPPING = {
  left: 'l',
  right: 'r',
  buttonOn: 'b',
  buttonOff: 'o',
}

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

const LIVES_STYLE = {
  ...FONT_STYLE,
  boundsAlignV: 'middle',
  boundsAlignH: 'left',
}

const PADDLE_MOVE_MULTIPLIER = 7

export default class MainGame extends Phaser.State {
  init (status = {}) {
    this.objects = {
      paddle: Paddle(this.game),
    }
    this.score = status.score || 0
    this.lives = status.lives || 3
    this.started = false // FIXME: State machine
  }

  preload () {
    this.load.image('background', 'assets/bg1.png')
    this.load.image('frame', 'assets/frame.png')
    this.objects.paddle.preload()
    this.load.image('ball', 'assets/ball.png')
    this.load.image('avatar', 'assets/avatar-default.png')
  }

  create () {
    const {game, objects} = this

    game.plugins.add(PhaserDebug)

    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.physics.arcade.checkCollision.down = false

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

    const score = this.add.text(0, 0, this.score.toString(10), SCORE_STYLE)
    score.setTextBounds(...scoreBounds)

    objects.score = score

    // AVATAR
    this.add.sprite(5, 10, 'avatar')

    // LIVES
    const livesBounds = [
      CANVAS_BORDER + AVATAR_WIDTH,
      CANVAS_BORDER,
      200,
      54,
    ]
    const lives = this.add.text(0, 0, `× ${this.lives.toString(10)}`, LIVES_STYLE)
    lives.setTextBounds(...livesBounds)
    objects.lives = lives

    // BRICKS
    // objects.bricks.add(200, 150)
    const bricks = game.add.group()
    bricks.enableBody = true
    bricks.physicsBodyType = Phaser.Physics.ARCADE
    this.objects.bricks = bricks
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
    const ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball')
    ball.anchor.set(0.5)
    ball.checkWorldBounds = true
    game.physics.enable(ball, Phaser.Physics.ARCADE)
    ball.body.collideWorldBounds = true
    ball.body.bounce.set(1)

    ball.events.onOutOfBounds.add(this.onBallLost, this)
    objects.ball = ball
    this.setupInput()
    this.fieldReset()
  }

  setupInput () {
    this.resetInput()
    // sets up input for hotkeys,
    // i.e. events from Arduino we *have to* capture
    const {game} = this
    // game.input.keyboard.addKeyCapture(KEYS_MAPPING)
    game.input.keyboard.addCallbacks(this, undefined, undefined, this.onKeyPress)
  }

  onKeyPress (e) {
    if (!this.started) {
      return
    }

    const {keys} = this
    switch (e) {
      case KEYS_MAPPING.left:
        keys.move -= 1
        break
      case KEYS_MAPPING.right:
        keys.move += 1
        break
      case KEYS_MAPPING.buttonOn:
        keys.button = true
        break
      case KEYS_MAPPING.buttonOff:
        keys.button = false
        break
    }
    console.log(keys)
  }

  fieldReset () {
    const {game, objects} = this
    objects.ball.reset(game.world.centerX, game.world.centerY + 100)
    objects.paddle.reset()
    this.startTimer()
  }

  resetInput () {
    this.keys = {
      move: 0,
      button: false,
    }
  }

  update () {
    if (!this.started) {
      return
    }

    const {game, objects, keys} = this
    const {ball} = objects
    const paddle = objects.paddle.getSprite()

    if (keys.move !== 0) {
      paddle.x += (keys.move * PADDLE_MOVE_MULTIPLIER) // FIXME: perhaps we should check time delta
      keys.move = 0
    }

    const paddleSpeed = 5
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      paddle.x -= paddleSpeed
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      paddle.x += paddleSpeed
    }

    game.physics.arcade.collide(ball, paddle, this.onBallHitPaddle, null, this)
    game.physics.arcade.collide(ball, objects.bricks, this.onBallHitBrick, null, this)
  }

  startTimer () {
    const {game} = this
    this.started = false
    const readyText = this.add.text(game.world.centerX, game.world.centerY + 50, 'READY', FONT_STYLE)
    readyText.anchor.set(0.5)
    game.time.events.add(Phaser.Timer.SECOND * 2, () => {
      readyText.destroy()
      this.resetInput()
      this.started = true
      this.objects.ball.body.velocity.set(150, -150)
    }, this)
  }

  onBallLost () {
    const currentLives = this.addLives(-1)
    if (currentLives < 0) {
      this.state.start('GameOver', true, false, {win: false})
    } else {
      this.fieldReset()
    }
  }

  onBallHitPaddle (ball, paddle) {
    let diff = 0

    if (ball.x < paddle.x) {
      //  Ball is on the left-hand side of the paddle
      diff = paddle.x - ball.x
      ball.body.velocity.x = (-10 * diff)
    } else if (ball.x > paddle.x) {
      //  Ball is on the right-hand side of the paddle
      diff = ball.x - paddle.x
      ball.body.velocity.x = (10 * diff)
    } else {
      //  Ball is perfectly in the middle
      //  Add a little random X to stop it bouncing straight up!
      ball.body.velocity.x = 2 + Math.random() * 8
    }
  }

  onBallHitBrick (ball, brick) {
    brick.kill()
    this.addScore(10)

    //  Are they any bricks left?
    /*if (bricks.countLiving() == 0)
    {
      //  New level starts
      score += 1000;
      scoreText.text = 'score: ' + score;
      introText.text = '- Next Level -';

      //  Let's move the ball back to the paddle
      ballOnPaddle = true;
      ball.body.velocity.set(0);
      ball.x = paddle.x + 16;
      ball.y = paddle.y - 16;
      ball.animations.stop();

      //  And bring the bricks back from the dead :)
      bricks.callAll('revive');
    }*/
  }

  addScore (val) {
    this.score += val
    this.objects.score.text = this.score
  }

  addLives (val) {
    this.lives += val
    this.objects.lives.text = `× ${this.lives}`
    return this.lives
  }
}
