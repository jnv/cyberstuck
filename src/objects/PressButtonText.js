import style from '../style'

const FONT_STYLE = {
  ...style.font,
  fontSize: '16px',
  // wordWrapWidth: 450,
}

export default class PressButtonText extends Phaser.Group {
  static thunk (what, callback) {
    return (game, parent) => {
      return new PressButtonText(game, parent, what).pressOnce(callback)
    }
  }

  constructor (game, parent, what = 'start') {
    super(game)
    this.x = 0
    this.y = 580

    const str = `PRESS BUTTON TO ${what.toUpperCase()}`

    const text = parent.add.text(20, 0, str, FONT_STYLE)
    this.add(text)
    this.create(64, 30, 'down')

    this.alpha = 0
    parent.add.tween(this).to({alpha: 1}, 500, Phaser.Easing.Exponential.Out, true, 0, -1, true)

    /*
    const input = parent.input.keyboard.addKey(BUTTON)
    this.onButtonPress = input.onDown
    */

    parent.add.existing(this)
  }

  onKeyPress () {
    if (this.callback && !this.fired) {
      this.callback()
      this.fired = true
    }
  }

  pressOnce (callback) {
    this.game.input.keyboard.addCallbacks(this, null, null, this.onKeyPress)
    this.callback = callback
  }
}
