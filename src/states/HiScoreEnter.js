import style from '../style'
import GameStatus from '../GameStatus'

const TEXT = `CONGRATULATIONS!
You made your mark in the Cyberspace.

Enter your initials:`

const FONT_STYLE = {
  ...style.font,
  wordWrapWidth: 470,
  wordWrap: true,
}

const INITIALS_STYLE = {
  ...style.font,
  fontSize: '64px',
}


export default class HiScoreEnter extends Phaser.State {
  init (status) {
    if (!status) {
      status = GameStatus()
    }

    this.gameStatus = status
    console.log(this.gameStatus)
  }

  preload () {

  }

  create () {
    const {game} = this

    this.add.sprite(0, 0, 'bg_base')
    const text = this.add.text(game.world.centerX, 50, TEXT, FONT_STYLE)
    text.anchor.set(0.5, 0)

    const initials = ['A', 'A', 'A']
    this.initials = initials
    this.currentLetter = 0

    const letters = []
    const letterBox = 100

    const startPos = game.world.centerX - letterBox

    for (var i = 0; i < 3; i++) {
      const letter = this.add.text(startPos + i * letterBox, game.world.centerY, initials[i], INITIALS_STYLE)
      letter.anchor.set(0.5)
      letters[i] = letter
    }
  }

  update () {

  }
}

