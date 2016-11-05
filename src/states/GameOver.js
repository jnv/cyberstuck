import style from '../style'
import PressButtonText from '../objects/PressButtonText'
import {hasHiscore, saveGame} from '../lib/hiscore'
import GameStatus from '../GameStatus'

const HISCORE_FONT = {
  ...style.font,
  fill: style.colors.red,
}

export default class GameOver extends Phaser.State {
  init (gameStatus) {
    // DEV
    /*
    if (!gameStatus) {
      gameStatus = GameStatus({score: 9000})
    }
    */

    this.gameStatus = gameStatus
  }

  preload () {

  }

  create () {
    const {game, gameStatus} = this
    this.add.sprite(0, 0, 'bg_base')

    let nextState = 'Finish'
    let textStr = 'GAME OVER'

    if (gameStatus.won) {
      textStr = 'THE WINNER IS YOU!'
    }

    const finalText = this.add.text(game.world.centerX, game.world.centerY - 40, textStr, style.font)
    finalText.anchor.set(0.5)

    hasHiscore(gameStatus).then(has => {
      if (has) {
        this.addHiscoreText()
        nextState = 'HiScoreEnter'
      } else {
        saveGame(gameStatus)
      }
    })
    .then(() => {
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

