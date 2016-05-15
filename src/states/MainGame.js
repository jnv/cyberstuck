import colors from '../colors'
import Hud from '../objects/Hud'
import Paddle from '../objects/Paddle'
import Level from '../objects/Level'
import BricksGroup from '../objects/BricksGroup'
import LEVELS from '../levels'
// import BrickFactory from '../objects/BrickFactory'

const FRAME_INNER_BORDER = 19
const CANVAS_BORDER = 20
const BRICK_WIDTH = 42
const BRICK_HEIGHT = 20
const AVATAR_WIDTH = 64

export default class MainGame extends Phaser.State {
  init (status = {level: 1, score: 0, lives: 3}) {
    this.gameStatus = status

    this.levelSpec = LEVELS[status.level]
  }

  preload () {
    this.load.image('frame', 'assets/frame.png')
    this.load.image('ball', 'assets/ball.png')
    Paddle.preload(this)
    Level.preload(this, this.gameStatus.level)
    BricksGroup.preload(this)

    this.load.image('avatar', 'assets/avatar-default.png')
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
    this.bricks = new BricksGroup(game, this, worldBounds[0], worldBounds[1])
    this.bricks.addBricks(this.levelSpec)
  }

  update () {

  }

}
