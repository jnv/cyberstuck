import style from '../style'
import PressButtonText from '../objects/PressButtonText'

export default class Win extends Phaser.State {
  init ({win}) {
    this.win = win || false
  }

  preload () {

  }

  create () {
    const {game} = this

    let textStr = 'THE WINNER IS YOU!'

    const finalText = this.add.text(game.world.centerX, game.world.centerY, textStr, style.font)
    finalText.anchor.set(0.5)

    new PressButtonText(game, this, 'continue').pressOnce(() => {
      window.location.reload(false)
    })
  }

  update () {

  }
}

