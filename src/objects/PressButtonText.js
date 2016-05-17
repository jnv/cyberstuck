import style from '../style'

const BUTTON = Phaser.Keyboard.B

const FONT_STYLE = {
  ...style.font,
  fontSize: '20px',
  // wordWrapWidth: 450,
}

export default class PressButtonText extends Phaser.Group {
  constructor (game, parent, what = 'start') {
    super(game)
    this.x = 0
    this.y = 580

    const str = `PRESS BUTTON TO ${what.toUpperCase()}`

    const text = parent.add.text(game.world.centerX, 0, str, FONT_STYLE)
    this.add(text)
    text.anchor.set(0.5, 0)
    this.create(64, 30, 'down')

    this.alpha = 0
    parent.add.tween(this).to({alpha: 1}, 500, Phaser.Easing.Exponential.Out, true, 0, -1, true)

    const input = parent.input.keyboard.addKey(BUTTON)
    this.onButtonPress = input.onDown

    parent.add.existing(this)
  }
}
