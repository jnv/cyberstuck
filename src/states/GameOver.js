import style from '../style'
import PressButtonText from '../objects/PressButtonText'

export default class GameOver extends Phaser.State {
  init ({score}) {
  }

  preload () {

  }

  create () {
    const {game} = this

    let textStr = 'GAME OVER'

    const finalText = this.add.text(game.world.centerX, game.world.centerY, textStr, style.font)
    finalText.anchor.set(0.5)

    new PressButtonText(game, this, 'continue').pressOnce(() => {
      window.location.reload(false)
    })
  }

  update () {

  }
}

