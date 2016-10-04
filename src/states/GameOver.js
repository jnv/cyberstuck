import style from '../style'
import PressButtonText from '../objects/PressButtonText'
import {hasHiscoreOrSave} from '../lib/hiscore'

const HISCORE_FONT = {
  ...style.font,
  fill: style.colors.red,
}

export default class GameOver extends Phaser.State {
  init (gameStatus) {
    this.gameStatus = gameStatus
  }

  preload () {

  }

  create () {
    const {game} = this
    this.add.sprite(0, 0, 'bg_base')

    let nextState = 'Finish'
    const textStr = 'GAME OVER'

    const finalText = this.add.text(game.world.centerX, game.world.centerY - 40, textStr, style.font)
    finalText.anchor.set(0.5)

    // Fixme: gameStatus save could be moved to HiScoreEnter
    hasHiscoreOrSave(this.gameStatus)
      .then(has => {
        if (has) {
          this.addHiscoreText()
          nextState = 'HiScoreEnter'
        }
        new PressButtonText(game, this, 'continue').pressOnce(() => {
          this.state.start(nextState, true, false, this.gameStatus)
        })
      })
  }

  addHiscoreText () {
    const text = this.add.text(this.game.world.centerX, this.game.world.centerY + 20, 'NEW HI-SCORE!', HISCORE_FONT)
    text.anchor.set(0.5)
  }

  update () {

  }
}

