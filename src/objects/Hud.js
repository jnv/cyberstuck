import style from '../style'
import config from '../config'

const FONT_STYLE = {
  ...style.font,
}

const TITLE_STYLE = {
  ...FONT_STYLE,
  boundsAlignV: 'top',
  boundsAlignH: 'right',
  fill: style.colors.red,
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

const scoreBounds = [
  0, // X
  style.canvasBorder, // Y
  style.canvasWidth, // Width
  54, // HEIGHT
]

const livesBounds = [
  style.canvasBorder + config.avatar.width,
  style.canvasBorder,
  200,
  54,
]

export default class Hud extends Phaser.Group {
  constructor (game) {
    super(game, null, 'Hud')

    this.score = this.addScoreText(game)
    this.lives = this.addLivesText(game)
    this.avatar = this.addAvatar(game)
  }

  addScoreText (game) {
    const scoreTitle = game.add.text(0, 0, 'SCORE', TITLE_STYLE)
    scoreTitle.setTextBounds(...scoreBounds)

    const score = game.add.text(0, 0, '?', SCORE_STYLE)
    score.setTextBounds(...scoreBounds)

    return score
  }

  addAvatar (game) {
    return game.add.sprite(5, 10, 'avatar')
  }

  addLivesText (game) {
    const lives = game.add.text(0, 0, '× ?', LIVES_STYLE)
    lives.setTextBounds(...livesBounds)
    return lives
  }

  update (state) {
    this.score.text = state.score
    this.lives.text = `× ${state.lives}`
  }

}
