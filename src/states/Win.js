import style from '../style'
import PressButtonText from '../objects/PressButtonText'

export default class Win extends Phaser.State {
  init (gameStatus) {
    this.gameStatus = gameStatus
  }

  preload () {

  }

  create () {
    const {game} = this

    let textStr = 'THE WINNER IS YOU!'

    const finalText = this.add.text(game.world.centerX, game.world.centerY, textStr, style.font)
    finalText.anchor.set(0.5)

    new PressButtonText(game, this, 'continue').pressOnce(() => {
      this.state.start('HiScoreEnter', true, false, this.gameStatus)
    })
  }

  update () {

  }
}

