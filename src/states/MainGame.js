import StateMachine from '../StateMachine'

import style from '../style'

import Hud from '../objects/Hud'
import Paddle from '../objects/Paddle'
import Level from '../objects/Level'
import BricksGroup from '../objects/BricksGroup'
import Ball from '../objects/Ball'
import LEVELS from '../levels'
// import BrickFactory from '../objects/BrickFactory'

const FRAME_INNER_BORDER = 19

const KEYS_MAPPING = {
  left: 'l',
  right: 'r',
  buttonOn: 'b',
  buttonOff: 'o',
  button: ' ',
}

export default class MainGame extends Phaser.State {
  init (status = {level: 1, score: 0, lives: 2}) {
    const {game} = this

    this.gameStatus = status
    this.levelSpec = LEVELS[status.level]

    const levelText = `LEVEL ${status.level}`

    const sm = StateMachine.create({
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
            sm.start()
          })
        },
        onPlaying: () => {
          // start ball
          this.resetInput()
          this.ball.start()
        },
        onbeforeballLost: () => {
          this.gameStatus.lives -= 1
          if (this.gameStatus.lives < 0) {
            sm.lose()
            return false
          }
          this.hud.update(this.gameStatus)
          this.ball.reset()
        },
        onWon: () => {
          // check if there are more levels
          const nextLevel = this.gameStatus.level + 1
          // either transition to MainGame state with new level or go to Win
          if (LEVELS[nextLevel]) {
            const newStatus = {...this.gameStatus, level: nextLevel}
            this.state.start('MainGame', true, false, newStatus)
          } else {
            this.state.start('Win', true, false, this.gameStatus)
          }
        },
        onLost: () => {
          this.state.start('GameOver', true, false, this.gameStatus)
        },
      },
    })
    this.sm = sm
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
    ball.events.onOutOfBounds.add(() => this.sm.ballLost())
    this.ball = ball

    game.input.keyboard.addCallbacks(this, undefined, undefined, this.onKeyPress)
    game.input.mouse.mouseWheelCallback = this.onMouseWheel.bind(this)
    this.sm.init()
  }

  addScore (amount) {
    this.gameStatus.score += amount
    this.hud.update(this.gameStatus)
  }

  resetInput () {
    this.paddle.resetMovement()
  }

  onMouseWheel (e) {
    e.preventDefault()
    if (!this.sm.is('Playing')) {
      return
    }
    if (event.deltaY < 0) {
      this.paddle.moveLeft()
    } else {
      this.paddle.moveRight()
    }
  }

  onKeyPress (char, event) {
    if (!this.sm.is('Playing')) {
      return
    }
    event.preventDefault()

    const {keys} = this
    switch (char) {
      case KEYS_MAPPING.left:
        this.paddle.moveLeft()
        break
      case KEYS_MAPPING.right:
        this.paddle.moveRight()
        break
      case KEYS_MAPPING.buttonOn:
        keys.button = true
        break
      case KEYS_MAPPING.buttonOff:
        keys.button = false
        break
      case ' ':
        console.log('button pressed')
        break
      // XXX: debugging
      case 'w':
        this.sm.win()
        break
      case 'q':
        this.sm.lose()
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
      this.sm.win()
    }
  }

  update () {
    if (!this.sm.is('Playing')) {
      return
    }

    const {game, ball, paddle, bricks} = this

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
