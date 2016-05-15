import colors from '../colors'
import Hud from '../objects/Hud'
import Paddle from '../objects/Paddle'
import Level from '../objects/Level'
// import BrickFactory from '../objects/BrickFactory'

const FRAME_INNER_BORDER = 18
const CANVAS_BORDER = 20
const BRICK_WIDTH = 42
const BRICK_HEIGHT = 20
const AVATAR_WIDTH = 64

export default class MainGame extends Phaser.State {
  init (status = {level: 1, score: 0, lives: 3}) {
    this.gameStatus = status
  }

  preload () {
    this.load.image('frame', 'assets/frame.png')
    this.load.image('ball', 'assets/ball.png')
    Paddle.preload(this)
    Level.preload(this, this.gameStatus.level)

    this.load.image('avatar', 'assets/avatar-default.png')
  }

  create () {
    const {game, gameStatus} = this

    this.level = new Level(game, this, gameStatus)
    this.hud = new Hud(this)
    this.hud.update(gameStatus)

    this.paddle = new Paddle(game, this)
  }

  update () {

  }

}
