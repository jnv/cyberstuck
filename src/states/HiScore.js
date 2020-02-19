import style from '../style'
import {getHiscore} from '../lib/hiscore'
import Avatar from '../objects/Avatar'
// import PressButtonText from '../objects/PressButtonText'

const ROW_HEIGHT = 45
const ROW_MARGIN = 7
const TOP_MARGIN = 60
const H_MARGIN = 60
const AVATAR_SCALE = 0.6

const INITIALS_STYLE = {
  ...style.font,
  boundsAlignH: 'left',
  boundsAlignV: 'middle',
}

const SCORE_STYLE = {
  ...style.font,
  boundsAlignH: 'right',
  boundsAlignV: 'middle',
}

export default class HiScore extends Phaser.State {
  init(options) {
    this.options = {
      nextState: 'Title',
      pressTextThunk: null, // PressButtonText.thunk('wat', () => {}),
      timeout: 5000,
      highlight: null,
      ...options,
    }

    this.game.detectIdle.disable()
  }

  preload() {}

  create() {
    const {game, options} = this

    this.add.sprite(0, 0, 'bg_base')

    const title = this.add.text(
      game.world.centerX,
      style.canvasBorder,
      'HI-SCORES',
      style.fontTitle
    )
    title.anchor.set(0.5, 0)

    getHiscore().then((scores) => {
      for (var i = scores.length - 1; i >= 0; i--) {
        const data = scores[i]
        const row = this.add.group()
        row.x = H_MARGIN
        row.y = (ROW_MARGIN + ROW_HEIGHT) * i + TOP_MARGIN
        this.addAvatar(row, data.avatar, i)
        this.addInitials(row, data.initials)
        this.addScore(row, data.score)
      }
    })

    if (options.timeout && this.options.nextState) {
      this.time.events.add(this.options.timeout, this.nextState, this)
    }

    if (options.pressTextThunk) {
      options.pressTextThunk(game, this)
    }
  }

  addAvatar(group, id, i) {
    const sprite = new Avatar(this, 0, 0, id)
    sprite.scale.set(AVATAR_SCALE)
    group.add(sprite)
  }

  addInitials(group, value) {
    const text = this.add.text(0, 0, value, INITIALS_STYLE)
    text.setTextBounds(70, 0, 300, ROW_HEIGHT)
    group.add(text)
  }

  addScore(group, value) {
    const text = this.add.text(0, 0, value, SCORE_STYLE)
    text.setTextBounds(H_MARGIN, 0, 480 - H_MARGIN * 3, ROW_HEIGHT)
    group.add(text)
  }

  nextState() {
    this.state.start(this.options.nextState, true, false)
  }

  shutdown() {
    this.game.detectIdle.enable()
  }
}
