import PhaserDebug from 'phaser-debug'
import GameStatus from '../GameStatus'
import Avatar from '../entities/Avatar'
import colors from '../colors'

const FRAME_INNER_BORDER = 18
const CANVAS_BORDER = 20

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
  init (gameStatus = null) {
    this.objects = {}
  }

  preload () {
    this.load.image('background', 'assets/bg1.png')
    this.load.image('frame', 'assets/frame.png')
    this.load.spritesheet('paddle', 'assets/paddle.png', 100, 15)
  }

  create () {
    const {game} = this

    game.plugins.add(PhaserDebug)

    game.physics.startSystem(Phaser.Physics.ARCADE)

    // BACKGROUND AND FRAME
    this.add.sprite(0, 0, 'background')
    const frameImg = game.cache.getImage('frame')
    const frameY = game.height - frameImg.height
    this.add.sprite(0, frameY, 'frame')

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

    this.objects.score = score

    // PADDLE
    const paddle = game.add.sprite(game.world.centerX, game.world.height - 30, 'paddle')
    paddle.anchor.setTo(0.5, 0.5)
    paddle.animations.add('default')
    paddle.animations.play('default', 2, true)
  }

  update () {

  }
}

