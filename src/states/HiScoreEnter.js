import style from '../style'
import {saveGame} from '../lib/hiscore'
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

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
const INITIALS_COUNT = 3

function iToChar (i) {
  return ALPHABET[i]
}

// http://javascript.about.com/od/problemsolving/a/modulobug.htm
function modulo (a, b) {
  return ((a % b) + b) % b
}

export default class HiScoreEnter extends Phaser.State {
  init () {
  }

  preload () {

  }

  create () {
    const {game} = this

    this.add.sprite(0, 0, 'bg_base')
    const text = this.add.text(game.world.centerX, 50, TEXT, FONT_STYLE)
    text.anchor.set(0.5, 0)

    this.currentLetter = -1

    const letters = []
    const tweens = []
    const letterIndex = [0, 0, 0]
    const letterBox = 100

    const startPos = game.world.centerX - letterBox

    for (var i = 0; i < INITIALS_COUNT; i++) {
      const letter = this.add.text(startPos + i * letterBox, game.world.centerY, 'A', INITIALS_STYLE)
      letter.charIndex = 0 // XXX: modifying class
      letter.anchor.set(0.5)
      letters[i] = letter
      tweens[i] = this.add.tween(letter).to({alpha: 0.2}, 300, Phaser.Easing.Quadratic.Out, false, 0, -1, true)
    }

    this.letterIndex = letterIndex
    this.letters = letters
    this.tweens = tweens

    this.input.keyboard.addCallbacks(this, null, null, this.onKeyPress)
    this.input.mouse.mouseWheelCallback = this.onMouseWheel.bind(this)

    this.letterForward()
  }

  letterForward () {
    if (this.currentLetter >= 0) {
      // stop animating last letter
      // set alpha to 1
      this.tweens[this.currentLetter].stop()
      this.letters[this.currentLetter].alpha = 1
    }

    this.currentLetter++

    if (this.currentLetter >= this.letters.length) {
      return this.nextState()
    }

    const tween = this.tweens[this.currentLetter]

    tween.start()
  }

  letterChange (by) {
    const letter = this.letters[this.currentLetter]
    const newIndex = modulo(letter.charIndex + by, ALPHABET.length)

    letter.charIndex = newIndex
    letter.setText(iToChar(newIndex))
    letter.alpha = 1
  }

  getInitials () {
    return this.letters.map(l => l.text).join('')
  }

  onKeyPress (char, event) {
    event.preventDefault()
    if (char === ' ') {
      this.letterForward()
    }
  }

  onMouseWheel (e) {
    e.preventDefault()
    if (event.deltaY < 0) {
      this.letterChange(-1)
    } else {
      this.letterChange(+1)
    }
  }

  nextState () {
    const {status} = this.game
    const initials = this.getInitials()
    status.setInitials(initials)
    console.log(initials)
    saveGame(status.all).then(insertedIndex => {
      this.state.start('HiScore', true, false, {nextState: 'Finish', highlight: insertedIndex})
    })
  }

  update () {
  }
}

