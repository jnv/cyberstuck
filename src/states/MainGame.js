import StateMachine from 'state-machine'

import style from '../style'

import Hud from '../objects/Hud'
import Paddle from '../objects/Paddle'
import Level from '../objects/Level'
import BricksGroup from '../objects/BricksGroup'
import Ball from '../objects/Ball'
import LEVELS from '../levels'
// import BrickFactory from '../objects/BrickFactory'

const FRAME_INNER_BORDER = 19
const PADDLE_MOVE_MULTIPLIER = 7

const KEYS_MAPPING = {
  left: 'l',
  right: 'r',
  buttonOn: 'b',
  buttonOff: 'o',
}

export default class MainGame extends Phaser.State {
  init (status = {level: 1, score: 0, lives: 1}) {
    const {game} = this

    this.gameStatus = status
    this.levelSpec = LEVELS[status.level]

    const levelText = `LEVEL ${status.level}`

    const state = StateMachine.create({
      events: [
        {name: 'init', from: 'none', to: 'Ready'},
        {name: 'start', from: 'Ready', to: 'Playing'},
        {name: 'ballLost', from: 'Playing', to: 'Ready'},
        {name: 'win', from: 'Playing', to: 'Won'},
        {name: 'lose', from: ['Ready', 'Playing'], to: 'Lost'},
        // {name: 'reset', from: 'Display', to: 'NoFace'},
      ],
      callbacks: {
        onReady: () => {
          // display LEVEL text
          const readyText = this.add.text(game.world.centerX, game.world.centerY + 50, levelText, style.font)
          readyText.anchor.set(0.5)
          // setup timer for start()
          game.time.events.add(Phaser.Timer.SECOND * 2, () => {
            readyText.destroy()
            state.start()
          })
        },
        onPlaying: () => {
          // start ball
          console.log('onPlaying')
          this.resetInput()
          this.ball.start()
        },
        onbeforeballLost: () => {
          this.gameStatus.lives -= 1
          if (this.gameStatus.lives < 0) {
            state.lose()
            return false
          }
          this.hud.update(this.gameStatus)
          this.ball.reset()
        },
        onWon: () => {
          // check if there are more levels
          // either transition to MainGame state with new level or go to Win
        },
        onLost: () => {
          console.log('lost')
          // go to GameOver state
        },
      },
    })
    this.state = state
  }

  preload () {
    Paddle.preload(this)
    Level.preload(this, this.gameStatus.level)
    BricksGroup.preload(this)
    Ball.preload(this)
  }

  create () {
    const {game, gameStatus} = this

    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.physics.arcade.checkCollision.down = false

    this.level = new Level(game, this, gameStatus.level)
    this.hud = new Hud(this)
    this.hud.update(gameStatus)
    const {frame} = this.level
    const worldBounds = [
      0 + FRAME_INNER_BORDER, // X
      frame.y + FRAME_INNER_BORDER, // Y
      frame.width - (2 * FRAME_INNER_BORDER), // width
      frame.height - FRAME_INNER_BORDER, // height; just a single border!
    ]
    // we are setting world bounds to be smaller than camera
    // source: http://www.html5gamedevs.com/topic/8048-gameworldsetbounds-doesnt-work/#comment-48042
    game.camera.bounds.setTo(0, 0, game.width, game.height)
    game.world.bounds.setTo(...worldBounds)
    game.physics.setBoundsToWorld()

    this.paddle = new Paddle(game, this)
    this.paddle.setBoundaries(worldBounds[0], frame.width - FRAME_INNER_BORDER)
    this.bricks = new BricksGroup(game, this, worldBounds[0], worldBounds[1])
    this.bricks.addBricks(this.levelSpec)

    const ball = new Ball(game, this)
    ball.enablePhysics()
    ball.events.onOutOfBounds.add(() => this.state.ballLost())
    this.ball = ball

    game.input.keyboard.addCallbacks(this, undefined, undefined, this.onKeyPress)

    this.state.init()
  }

  addScore (amount) {
    this.gameStatus.score += amount
    this.hud.update(this.gameStatus)
  }

  resetInput () {
    this.keys = {
      move: 0,
      button: false,
    }
  }

  onKeyPress (char, event) {
    if (!this.state.is('Playing')) {
      return
    }
    event.preventDefault()

    const {keys} = this
    switch (char) {
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
    brick.damage(1)
    this.addScore(10)

    //  Are there any bricks left?
    if (this.bricks.countLiving() === 0) {
      this.state.win()
    }
  }

  update () {
    if (!this.state.is('Playing')) {
      return
    }

    const {keys, game, ball, paddle, bricks} = this

    if (keys.move !== 0) {
      paddle.x += (keys.move * PADDLE_MOVE_MULTIPLIER) // FIXME: perhaps we should check time delta
      keys.move = 0
    }

    const paddleSpeed = 10
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      paddle.x -= paddleSpeed
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      paddle.x += paddleSpeed
    }

    this.paddle.adjustToBoundaries()

    game.physics.arcade.collide(ball, paddle, this.onBallHitPaddle, null, this)
    game.physics.arcade.collide(ball, bricks, this.onBallHitBrick, null, this)
  }

}
