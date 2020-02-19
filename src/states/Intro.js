import style from '../style'
import PressButtonText from '../objects/PressButtonText'

// StuNoMe je uvězněné! Už 10 let trpí ve zdech kyberprostoru a ztrácí naději. Nyní se ale poprvé za tu nekonečnou dobu, přesně po 10ti letech, objevila štěrbina v časoprostoru. A ty je můžeš zachránit! Vítej: Cesta je otevřená, stačí vstoupit. Připrav se na svou misi a zachraň StuNoMe.
const TEXT = `
StuNoMe is stuck in the Cyberspace, losing all their hope.

However, after the long 10 years a ripple to the real world appeared.
Now YOU have the chance to save them.
YOU are their only hope!

Get ready for your mission and save the StuNoMe...
`

const FONT_STYLE = {
  ...style.font,
  fontSize: '18px',
  wordWrapWidth: 450,
  wordWrap: true,
}

export default class Intro extends Phaser.State {
  preload() {}

  create() {
    const {game} = this
    game.status.newPlayer()
    this.add.sprite(0, 0, 'bg_base')
    const text = this.add.text(game.world.centerX, 100, TEXT, FONT_STYLE)
    text.alpha = 0
    text.anchor.set(0.5, 0)
    const tween = game.add
      .tween(text)
      .to({alpha: 1}, 200, Phaser.Easing.Circular.In, true)

    tween.onComplete.add(() => {
      game.time.events.add(1, this.readyNextState, this)
    })
  }

  readyNextState() {
    const button = new PressButtonText(this.game, this, 'continue')
    button.pressOnce(() => {
      this.state.start('Camera')
    })
  }
}
