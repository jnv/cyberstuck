import style from '../style'
import PressButtonText from '../objects/PressButtonText'
import {hasHiscore, saveGame} from '../lib/hiscore'

const HISCORE_FONT = {
  ...style.font,
  fill: style.colors.red,
}

export default class GameOver extends Phaser.State {
  init () {
  }

  preload () {

  }

  create () {
    const {game} = this
    this.add.sprite(0, 0, 'bg_base')

    let nextState = 'Finish'
    let textStr = 'GAME OVER'

    if (game.status.won) {
      textStr = 'THE WINNER IS YOU!'
    }

    const finalText = this.add.text(game.world.centerX, game.world.centerY - 40, textStr, style.font)
    finalText.anchor.set(0.5)

    hasHiscore(game.status.score).then(has => {
      if (has) {
        this.addHiscoreText()
        nextState = 'HiScoreEnter'
      } else {
        saveGame(game.status.all)
      }
    })
    .then(() => {
      new PressButtonText(game, this, 'continue').pressOnce(() => {
        this.state.start(nextState, true, false)
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

