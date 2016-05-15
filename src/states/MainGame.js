import colors from '../colors'
import Hud from '../objects/Hud'
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
    this.load.image('background', 'assets/bg1.png')
    this.load.image('frame', 'assets/frame.png')
    this.load.image('ball', 'assets/ball.png')
    this.load.image('avatar', 'assets/avatar-default.png')
  }

  create () {
    const {game} = this

    this.hud = new Hud(game, this)
    this.hud.update(this.gameStatus)
  }

  update () {

  }

}
